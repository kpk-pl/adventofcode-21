#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function processMovement(ctx, data) {
  const [cmd, param] = data.split(' ')

  if (cmd == 'forward')
    return {position: ctx.position + parseInt(param), depth: ctx.depth};
  if (cmd == 'down')
    return {position: ctx.position, depth: ctx.depth + parseInt(param)};
  if (cmd == 'up')
    return {position: ctx.position, depth: ctx.depth - parseInt(param)};

  return ctx;
}

let ctx = {position: 0, depth: 0};

reduceLines(localAssetPath(import.meta, 'input.txt'), processMovement, ctx).then(function(ctx){
  console.log(`${localPath(import.meta)}: Final position is ${JSON.stringify(ctx)}`);
  console.assert(ctx.position * ctx.depth == 1427868, "Expected position*depth 1427868");
});
