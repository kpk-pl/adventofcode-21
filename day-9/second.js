#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { Graph, bfs } from '../modules/2dgraph.js'

const opts = {
  adjacency: {n: true, s: true, w: true, e: true}
};

let graph = new Graph(localAssetPath(import.meta, 'input.txt'), opts);
const cond = (node) => node.value < 9 && !Boolean(node.visited);
const action = (node) => node.visited = true;

const basinSizes = graph.flat().reduce(function(acc, v) {
  if (! cond(v)) return acc;
  return [...acc, bfs(v, cond, action)];
}, []);

basinSizes.sort((l,r) => r-l);
basinSizes.splice(3);

console.log(`${localPath(import.meta)}: Biggest basins: ${basinSizes}`);

const answer = basinSizes[0] * basinSizes[1] * basinSizes[2];
console.assert(answer == 987840, "Expected 987840");
