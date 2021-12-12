#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { forEachLine } from '../modules/input.js';

let graph = Object.create(null);

function dfs() {
  let ways = 0;
  let stack = [{route: ['start'], smallTwice: false}];

  while (stack.length) {
    const back = stack.pop();
    const moves = back.route;
    for (let adj of graph[moves[moves.length-1]].adjacent) {
      if (adj == 'end') {
        ways += 1;
      }
      else if (adj == 'start') {} // cannot get back to the start
      else if (adj.toLowerCase() == adj) { // small cave
        if (moves.indexOf(adj) == -1)
          stack.push({route: [...moves, adj], smallTwice: back.smallTwice});
        else if (!back.smallTwice) {
          stack.push({route: [...moves, adj], smallTwice: true});
        }
      }
      else {
        stack.push({route: [...moves, adj], smallTwice: back.smallTwice});
      }
    }
  }

  return ways;
}

forEachLine(localAssetPath(import.meta, 'input.txt'), function(line) {
  function add(from, to) {
    if (! (from in graph))
      graph[from] = {adjacent: []};
    graph[from].adjacent.push(to);
  }

  let [from, to] = line.split('-');
  add(from, to);
  add(to, from);
}).then(function() {
  const ways = dfs();
  console.log(`${localPath(import.meta)}: Found ${ways} ways`);
  console.assert(ways == 93858, "Expected 93858");
});
