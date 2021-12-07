#!/usr/bin/env node

'use strict';

// https://stackoverflow.com/questions/23452479/minimise-the-sum-of-difference-between-each-element-of-an-array-and-an-integer-k

import readlines from 'n-readlines';
import { localAssetPath, localPath } from '../modules/fs.js'

let input = new readlines(localAssetPath(import.meta, 'input.txt'));
const numbers = input.next().toString('ascii').split(',').map(v => parseInt(v)).sort((a, b) => a - b);

const median = numbers[Math.floor(numbers.length/2)];

function cost(center) {
  return numbers.reduce((sum, v) => sum + Math.abs(v - center), 0);
}

const minCost = cost(median);

console.log(`Median is: ${median} and the cost is ${minCost}`);
console.assert(minCost == 352254, "Expected 352254");
