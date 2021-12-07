#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function processMovement(ctx, data) {
  const [cmd, param] = data.split(' ');
  const intParam = parseInt(param);

  if (cmd == 'forward')
    return {position: ctx.position + intParam, aim: ctx.aim, depth: ctx.depth + ctx.aim * intParam};
  if (cmd == 'down')
    return Object.assign({}, ctx, {aim: ctx.aim + intParam});
  if (cmd == 'up')
    return Object.assign({}, ctx, {aim: ctx.aim - intParam});

  return ctx;
}

let ctx = {position: 0, aim: 0, depth: 0};

reduceLines(localAssetPath(import.meta, 'input.txt'), processMovement, ctx).then(function(ctx){
  console.log(`${localPath(import.meta)}: Final position is ${JSON.stringify(ctx)}`);
  console.assert(ctx.position * ctx.depth == 1568138742, "Expected position*depth 1568138742");
});
