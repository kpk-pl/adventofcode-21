#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

class Decoder {
  constructor(input) {
    const [patterns, output] = input.split(' | ');
    this.patterns = patterns.split(' ');
    this.output = output.split(' ');
  }
}

reduceLines(localAssetPath(import.meta, 'input.txt'), function(acc, line){
  const decoder = new Decoder(line);
  return decoder.output.reduce((acc, out) => [2,3,4,7].includes(out.length) ? acc+1 : acc, acc);
}, 0).then(function(result){
  console.log(`${localPath(import.meta)}: All unique numbers: ${result}`);
  console.assert(result == 375, "Expected 375");
});
