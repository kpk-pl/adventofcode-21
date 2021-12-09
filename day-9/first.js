#!/usr/bin/env node

'use strict';

import * as fs from 'fs';
import { localAssetPath, localPath } from '../modules/fs.js'

const input = fs.readFileSync(localAssetPath(import.meta, 'input.txt'), "ascii").split('\n').filter(x => Boolean(x));

const height = input.length;
const width = input[0].length;

let graph = input.map((row, rowIdx) => row.split('').map(function(cell, colIdx){
  let adjacent = [];
  if (rowIdx > 0) adjacent.push({x: colIdx, y: rowIdx-1});
  if (rowIdx < height-1) adjacent.push({x: colIdx, y: rowIdx+1});
  if (colIdx > 0) adjacent.push({x: colIdx-1, y: rowIdx});
  if (colIdx < width-1) adjacent.push({x: colIdx+1, y: rowIdx});
  return {
    height: Number(cell),
    adjacent: adjacent
  };
}));

const riskLevels = graph.flat().reduce(function(acc, v){
  if (v.adjacent.reduce((belows, adj) => graph[adj.y][adj.x].height <= v.height ? belows+1 : belows, 0) == 0)
    return acc + v.height + 1;
  return acc;
}, 0);

console.log(`${localPath(import.meta)}: Risk levels: ${riskLevels}`);
console.assert(riskLevels == 600, "Expected 600");
