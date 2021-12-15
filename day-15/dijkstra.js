#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { Graph, dijkstra } from '../modules/2dgraph.js'

let graph = new Graph(localAssetPath(import.meta, 'input.txt'), {
  adjacency: {n: true, s: true, e: true, w: true}
});

const status = dijkstra(graph.at(0, 0), graph.at(graph.width-1, graph.height-1));

//console.log(JSON.stringify(status.path.map(n => {return {x: n.x, y: n.y};})));
console.log(`${localPath(import.meta)}: Search result: ${status.cost}`);
console.assert(status.cost == 717, "Expected 717");
