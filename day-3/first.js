#!/usr/bin/env node

'use strict';

import { forEachLine } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function processReportLine(ctx, line) {
  if (ctx.bitLength === undefined) {
    ctx.bitLength = line.length;
    for (let i = 0, l = ctx.bitLength; i < l; ++i)
      ctx.counts[i] = 0;
  }

  ctx.size += 1;

  for (let i = 0, l = line.length; i < l; ++i) {
    if (line[i] == '1')
      ctx.counts[i] += 1
  }
}

function reportResults(ctx) {
  let gamma = 0;
  let epsilon = 0;
  for (let i = 0, l = ctx.bitLength; i < l; ++i) {
    gamma *= 2;
    epsilon *= 2;
    if (ctx.counts[i] > ctx.size / 2)
      gamma += 1;
    else
      epsilon += 1;
  }

  return {gamma: gamma, epsilon: epsilon};
}

let ctx = {size: 0, bitLength: undefined, counts: {}};

forEachLine(localAssetPath(import.meta, 'input.txt'), function(line){
  processReportLine(ctx, line);
}).then(function(){
  const report = reportResults(ctx);
  console.log(`${localPath(import.meta)}: Report ${JSON.stringify(report)} indicates power consumption of ${report.gamma * report.epsilon}`);
  console.assert(report.gamma * report.epsilon == 3687446, "Expected 3687446");
});
