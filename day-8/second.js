#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

class Decoder {
  constructor(input) {
    const [patterns, output] = input.split(' | ');
    this.patterns = patterns.split(' ').map(v => v.split('').sort().join(''));
    this.codedOutput = output.split(' ').map(v => v.split('').sort().join(''));
    this.mapping = new Array(10).fill(undefined);
  }

  decode() {
    let remainingPatterns = [...this.patterns];
    let segments = Object.create(null);

    const ofLength = (l) => remainingPatterns.filter(p => p.length == l);
    const segmentDiff = (l,r) => l.replace(new RegExp(`[${r}]`, 'g'), '');
    const onlyOne = (e) => { if (e.length == 1) return e[0]; throw new Error(JSON.stringify(e)) };
    const foundPattern = (idx) => remainingPatterns.splice(remainingPatterns.indexOf(this.mapping[idx]), 1);

    this.mapping[1] = onlyOne(ofLength(2));
    this.mapping[7] = onlyOne(ofLength(3));
    this.mapping[4] = onlyOne(ofLength(4));
    this.mapping[8] = onlyOne(ofLength(7));
    remainingPatterns = remainingPatterns.filter(p => !this.mapping.includes(p));

    segments.a = segmentDiff(this.mapping[7], this.mapping[1])[0];

    // Length 6 patterns are 0, 6 or 9 but only 6 has exactly one common segment with 1
    this.mapping[6] = onlyOne(ofLength(6).filter(p => segmentDiff(p, this.mapping[1]).length == 5));
    foundPattern(6);
    segments.c = onlyOne(segmentDiff(this.mapping[8], this.mapping[6]));
    segments.f = this.mapping[1].replace(segments.c, '')[0];

    // Pattern of 6 minus something with length of 5 that has one common element with 5 gives 5
    this.mapping[5] = onlyOne(remainingPatterns.filter(p => p.length == 5 && segmentDiff(this.mapping[6], p).length == 1));
    foundPattern(5);
    segments.e = onlyOne(segmentDiff(this.mapping[6], this.mapping[5]));

    // A 9 is an 8 without 'e' segment
    this.mapping[9] = this.mapping[8].replace(segments.e, '');
    //this.mapping[9] = onlyOne(remainingPatterns.filter(p => segmentDiff(this.mapping[8].replace(segments.e, ''), p).length == 0));
    foundPattern(9);

    // As we already have 6 and 9, the only remaining pattern with length 6 is a 0
    this.mapping[0] = onlyOne(ofLength(6));
    foundPattern(0);
    segments.d = onlyOne(segmentDiff(this.mapping[8], this.mapping[0]));

    // Only one remaining pattern with 'f' inside is 3
    this.mapping[3] = onlyOne(remainingPatterns.filter(p => p.indexOf(segments.f) != -1));
    foundPattern(3);

    // The last one
    this.mapping[2] = onlyOne(remainingPatterns);
    foundPattern(2);
  }

  get output() {
    return this.codedOutput.map(co => this.mapping.indexOf(co)).reduce((acc, v) => acc*10 + v, 0);
  }
}

reduceLines(localAssetPath(import.meta, 'input.txt'), function(acc, line){
  const decoder = new Decoder(line);
  decoder.decode();
  return acc + decoder.output;
}, 0).then(function(result){
  console.log(`${localPath(import.meta)}: Sum of all values: ${result}`);
  console.assert(result == 1019355, "Expected 1019355");
});
