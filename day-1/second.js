#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function processDepthInfo(depthData, data) {
  const newDepth = new Number(data);

  if (depthData.window.length < 3)
    return {increased: 0, decreased: 0, window: depthData.window.concat(newDepth)}

  const newWindow = depthData.window.concat(newDepth).slice(1);
  const windowSum = depthData.window.reduce((l,r) => l+r, 0);
  const newWindowSum = newWindow.reduce((l,r) => l+r, 0);

  if (newWindowSum > windowSum)
    return {increased: depthData.increased+1, decreased: depthData.decreased, window: newWindow}
  if (newWindowSum < windowSum)
    return {increased: depthData.increased, decreased: depthData.decreased+1, window: newWindow}
  else
    return {increased: depthData.increased, decreased: depthData.decreased, window: newWindow}
}

let depthData = {increased: 0, decreased: 0, window: []};

reduceLines(localAssetPath(import.meta, 'input.txt'), processDepthInfo, depthData).then(function(result){
  console.log(`${localPath(import.meta)}: Counted ${result.increased} increases in depth`);
  console.assert(result.increased == 1743, "Expected 1743");
});
