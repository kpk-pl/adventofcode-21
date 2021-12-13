#!/usr/bin/env node

'use strict';

import { localAssetPath, localPath } from '../modules/fs.js'
import { forEachLine } from '../modules/input.js';
import { DiscreteMap, Point } from '../modules/2ddisplay.js';

let points = [];

function fold(desc) {
  let [axis, foldPos] = desc.split('=', 2);
  foldPos = Number(foldPos);

  if (axis == 'x')
    points = points.map(function(point) {
      return {x: (point.x > foldPos ? 2*foldPos - point.x : point.x), y: point.y};
    });
  else if (axis == 'y')
    points = points.map(function(point) {
      return {x: point.x, y: (point.y > foldPos ? 2*foldPos - point.y : point.y)};
    });

  points = points.sort((l, r) => l.y == r.y ? l.x - r.x : l.y - r.y).filter(
    (point, idx, arr) => idx > 0 ? (point.x != arr[idx-1].x || point.y != arr[idx-1].y) : true
  );
}

function display() {
  let displ = new DiscreteMap();
  points.forEach(point => displ.drawPoint(new Point(point.x, point.y)));

  for (let y = 0; y < displ.height; ++y)
    console.log(displ.map[y].map(v => v>0 ? '#' : ' ').join(''));
}

forEachLine(localAssetPath(import.meta, 'input.txt'), function(line) {
  if (!line)
    return;

  if (line.startsWith('fold along')) {
    fold(line.substr(11));
    return;
  }

  const [x, y] = line.split(',', 2);
  points.push({x: Number(x), y: Number(y)});
}).then(function() {
  display();
});
