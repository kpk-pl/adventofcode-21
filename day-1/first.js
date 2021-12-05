#!/usr/bin/env node

'use strict';

import { forEachLine } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function processDepthInfo(depthData, data) {
  const newDepth = new Number(data);
  if (depthData.depth === undefined)
    return {increased: 0, decreased: 0, depth: newDepth}
  if (newDepth > depthData.depth)
    return {increased: depthData.increased+1, decreased: depthData.decreased, depth: newDepth}
  if (newDepth < depthData.depth)
    return {increased: depthData.increased, decreased: depthData.decreased+1, depth: newDepth}
  else
    return {increased: depthData.increased, decreased: depthData.decreased, depth: newDepth}
}

let depthData = {increased: 0, decreased: 0, depth: undefined};

forEachLine(localAssetPath(import.meta, 'input.txt'), function(line){
  depthData = processDepthInfo(depthData, line);
}).then(function(){
  console.log(`${localPath(import.meta)}: Counted ${depthData.increased} increases in depth`);
  console.assert(depthData.increased == 1711, "Expected 1711");
});
