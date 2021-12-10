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

function bfs(start) {
  let remaining = [start];
  let visited = 0;

  while (remaining.length > 0) {
    let node = remaining.shift();
    if (node.height == 9 || node.visited)
      continue;

    node.visited = true;

    for (let n of node.adjacent)
      remaining.push(graph[n.y][n.x]);

    visited += 1;
  }

  return visited;
}

const basinSizes = graph.flat().reduce(function(acc, v) {
  if (v.height == 9 || v.visited) return acc;
  return [...acc, bfs(v)];
}, []);

basinSizes.sort((l,r) => r-l);
basinSizes.splice(3);

console.log(`${localPath(import.meta)}: Biggest basins: ${basinSizes}`);

const answer = basinSizes[0] * basinSizes[1] * basinSizes[2];
console.assert(answer == 987840, "Expected 987840");
