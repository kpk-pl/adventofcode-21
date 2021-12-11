#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { Graph } from '../modules/2dgraph.js'

const opts = {
  adjacency: {n: true, s: true, w: true, e: true}
};

let graph = new Graph(localAssetPath(import.meta, 'input.txt'), opts);

function bfs(start) {
  let remaining = [start];
  let visited = 0;

  while (remaining.length > 0) {
    let node = remaining.shift();
    if (node.value == 9 || node.visited)
      continue;

    node.visited = true;

    for (let n of node.adjacent)
      remaining.push(n.link);

    visited += 1;
  }

  return visited;
}

const basinSizes = graph.flat().reduce(function(acc, v) {
  if (v.value == 9 || v.visited) return acc;
  return [...acc, bfs(v)];
}, []);

basinSizes.sort((l,r) => r-l);
basinSizes.splice(3);

console.log(`${localPath(import.meta)}: Biggest basins: ${basinSizes}`);

const answer = basinSizes[0] * basinSizes[1] * basinSizes[2];
console.assert(answer == 987840, "Expected 987840");
