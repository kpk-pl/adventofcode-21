#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { Graph } from '../modules/2dgraph.js';

const opts = {
  adjacency: {n: true, s: true, w: true, e: true}
};

let graph = new Graph(localAssetPath(import.meta, 'input.txt'), opts);

const riskLevels = graph.flat().reduce(function(acc, v){
  if (v.adjacent.reduce((belows, adj) => adj.link.value <= v.value ? belows+1 : belows, 0) == 0)
    return acc + v.value + 1;
  return acc;
}, 0);

console.log(`${localPath(import.meta)}: Risk levels: ${riskLevels}`);
console.assert(riskLevels == 600, "Expected 600");
