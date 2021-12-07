#!/usr/bin/env node

'use strict';

import readlines from 'n-readlines';
import { localAssetPath, localPath } from '../modules/fs.js'

const birthIdx = 8;
const normalIdx = 6;
const maxIdx = birthIdx;

let input = new readlines(localAssetPath(import.meta, 'input.txt'));

let state = input.next().toString('ascii').split(',')
  .reduce((counts, v) => {counts[+v] += 1; return counts; }, new Array(maxIdx + 1).fill(0));

function* evolve(state) {
  while (true) {
    let newState = new Array(maxIdx + 1).fill(0);

    for (let x of Array(maxIdx).keys())
      newState[x] += state[x+1];

    newState[normalIdx] += state[0];
    newState[birthIdx] += state[0];

    state = newState;
    yield state;
  }
}

let evolution = evolve(state);

let result = null;
for (let i = 0; i < 80; ++i) {
  result = evolution.next().value;
}

result = result.reduce((sum, v) => sum + v, 0);
console.log(`Population: ${result}`);
console.assert(result == 372300, "Expected 372300");
