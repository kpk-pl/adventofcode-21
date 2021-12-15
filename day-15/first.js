#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { Graph } from '../modules/2dgraph.js'
import aStar from 'a-star'

let graph = new Graph(localAssetPath(import.meta, 'input.txt'), {
  adjacency: {n: true, s: true, e: true, w: true}
});

const status = aStar({
  start: graph.at(0, 0),
  isEnd: p => p.x == graph.width-1 && p.y == graph.height-1,
  neighbor: p => p.adjacent.map(a => a.link),
  distance: (l, r) => r.value,
  heuristic: p => Math.abs(graph.width-1-p.x) + Math.abs(graph.height-1-p.y),
  hash: p => `${p.x},${p.y}`
});

//console.log(JSON.stringify(status.status));
//console.log(JSON.stringify(status.path.map(n => {return {x: n.x, y: n.y};})));
console.log(`${localPath(import.meta)}: Search result: ${status.cost}`);
console.assert(status.cost == 717, "Expected 717");
