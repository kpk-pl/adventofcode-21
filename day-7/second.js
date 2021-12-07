#!/usr/bin/env node

'use strict';

import readlines from 'n-readlines';
import { localAssetPath, localPath } from '../modules/fs.js'

let input = new readlines(localAssetPath(import.meta, 'input.txt'));
const numbers = input.next().toString('ascii').split(',').map(v => parseInt(v)).sort((a, b) => a - b);

const mean = Math.floor(numbers.reduce((acc, v) => acc + v, 0) / numbers.length);

function cost(center) {
  const unitCost = (n) => (n * (n + 1)) / 2;
  return numbers.reduce((sum, v) => sum + unitCost(Math.abs(v - center)), 0);
}

const meanCost = cost(mean);
const lowerGuess = cost(mean - 1);
const upperGuess = cost(mean + 1);

const minCost = Math.min(meanCost, lowerGuess, upperGuess);

console.log(`Mean is: ${mean} and the cost for mean is ${meanCost}. True minimum is ${minCost}`);
console.assert(minCost == 99053143, "Expected 99053143");
