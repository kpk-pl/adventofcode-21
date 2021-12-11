#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { Graph, bfs } from '../modules/2dgraph.js';

const opts = {
  adjacency: {n: true, ne: true, e: true, se: true, s: true, sw: true, w: true, nw: true}
};

let graph = new Graph(localAssetPath(import.meta, 'input.txt'), opts);

function iteration() {
  let activated = graph.flat().reduce(function(acc, node) {
    node.value += 1;
    if (node.value > 9)
      return [...acc, node];
    return acc;
  }, []);

  const cond = (node) => !node.activated && node.value > 9;
  function action(node) {
    if (node.value > 9){
      node.activated = true;
      node.adjacent.forEach(adj => adj.link.value += 1);
    }
  }

  const flashes = bfs(activated, cond, action);

  graph.flat().forEach(function (node) {
    if (node.activated) {
      node.activated = false;
      node.value = 0;
    }
  });

  return flashes == graph.width * graph.height;
}

let i = 0;
do { ++i; } while (!iteration());

console.log(`${localPath(import.meta)}: First synchronization: ${i}`);
console.assert(i == 229, "Expected 229");
