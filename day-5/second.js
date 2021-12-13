#!/usr/bin/env node

'use strict';

import { forEachLine } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'
import { DiscreteMap, Line } from '../modules/2ddisplay.js'

let map = new DiscreteMap();

forEachLine(localAssetPath(import.meta, 'input.txt'), function(line){
  map.drawLine(new Line(line));
}).then(function(){
  const crosses = map.map.reduce(function(count, row) {
    return count + row.reduce((c, v) => v > 1 ? c + 1 : c, 0);
  }, 0)
  console.log(`Number of crosses: ${crosses}`);
  console.assert(crosses == 19472, "Expected 19472");
});
