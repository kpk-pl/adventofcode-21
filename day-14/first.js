#!/usr/bin/env node

'use strict';

import readlines from 'n-readlines';
import { localAssetPath, localPath } from '../modules/fs.js'

let input = new readlines(localAssetPath(import.meta, 'input.txt'));
let template = input.next().toString('ascii');
input.next();

let rules = Object.create(null);
for(let line = input.next(); line; line = input.next()) {
  const [tmpl, insert] = line.toString('ascii').split(' -> ');
  rules[tmpl] = insert;
}

function polymerize(input) {
  let result = input[0];
  for (let idx = 1; idx < input.length; ++idx) {
    const tmpl = input[idx-1] + input[idx];
    if (tmpl in rules)
      result += rules[tmpl];
    result += input[idx];
  }
  return result;
}

for (let i = 0; i < 10; ++i)
  template = polymerize(template);

const letterCounts = template.split('').reduce(function(acc, v){ if (v in acc) acc[v] += 1; else acc[v] = 1; return acc;  }, Object.create(null));
const sortedCounts = Object.values(letterCounts).sort((l, r) => r - l);
const answer = sortedCounts[0] - sortedCounts[sortedCounts.length-1];

console.log(`${localPath(import.meta)}: Answer: ${answer}`);
console.assert(answer == 2590, "Expected 2590");
