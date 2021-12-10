#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function compute(line) {
  const openings = ['(', '[', '{', '<'];
  const closings = [')', ']', '}', '>'];
  const matches = {'(': ')', '[': ']', '{': '}', '<': '>'};

  let stack = []
  for (const token of line) {
    if (openings.indexOf(token) != -1)
      stack.push(token);
    else if (closings.indexOf(token) != -1) {
      if (stack.length == 0)
        return {errno: 1, token: token, error: `Invalid syntax: Found closing token '${token}' while the stack is empty`};
      let top = stack.pop();
      if (matches[top] != token)
        return {errno: 2, token: token, error: `Invalid syntax: Found closing token '${token}' not matching opening token '${top}'`};
    }
    else
      return {errno: 4, token: token, error: `Invalid syntax: Unknown token '${token}'`};
  }

  if (stack.length != 0)
    return {errno: 3, stack: stack, error: `Stack not empty at the end of program`};

  return {success: true}
}

const points = {'(': 1, '[': 2, '{': 3, '<': 4};

reduceLines(localAssetPath(import.meta, 'input.txt'), function(acc, line){
  const result = compute(line);
  if (result.errno == 3)
    return [...acc, result.stack.reverse().reduce((acc, t) => acc*5 + points[t], 0)];

  return acc;
}, []).then(function(result){
  result.sort((l,r) => l - r);
  console.log(`${localPath(import.meta)}: Middle cost: ${result[Math.floor(result.length/2)]}`);
  console.assert(result == 2904180541, "Expected 2904180541");
});
