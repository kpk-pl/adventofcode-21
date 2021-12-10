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

const points = {')': 3, ']': 57, '}': 1197, '>': 25137};

reduceLines(localAssetPath(import.meta, 'input.txt'), function(acc, line){
  const result = compute(line);
  if (result.errno == 2)
    return acc + points[result.token];

  return acc;
}, 0).then(function(result){
  console.log(`${localPath(import.meta)}: Error sum: ${result}`);
  console.assert(result == 311895, "Expected 311895");
});
