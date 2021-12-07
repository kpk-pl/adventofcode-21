#!/usr/bin/env node

'use strict';

import { forEachLine } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

class Line {
  constructor(desc) {
    const [start, stop] = desc.split(' -> ');
    let [x, y] = start.split(',');
    this.begin = {x: +x, y: +y};

    [x, y] = stop.split(',');
    this.end = {x: +x, y: +y};
  }

  horizontal() {
    return this.begin.y == this.end.y;
  }

  vertical() {
    return this.begin.x == this.end.x;
  }
}

class DiscreteMap {
  constructor() {
    this.map = []
  }

  get width() {
    return this.map.length > 0 ? this.map[0].length : 0;
  }

  get height() {
    return this.map.length;
  }

  resizeWidth(width) {
    if (width <= this.width)
      return;

    this.map.forEach(function(value, idx, array) {
      while (array[idx].length < width)
        array[idx].push(0);
    });
  }

  resizeHeight(height) {
    if (height <= this.height)
      return;

    const width = this.width;

    while (this.map.length < height) {
      this.map.push(new Array(width).fill(0));
    }
  }

  resizeFor(obj) {
    if (obj instanceof Line) {
      this.resizeHeight(Math.max(obj.begin.y, obj.end.y) + 1);
      this.resizeWidth(Math.max(obj.begin.x, obj.end.x) + 1);
    }
  }

  drawLine(line) {
    this.resizeFor(line);

    if (line.horizontal()) {
      for (let x = Math.min(line.begin.x, line.end.x); x <= Math.max(line.begin.x, line.end.x); ++x)
        this.map[line.begin.y][x] += 1;
    }
    else if (line.vertical()) {
      for (let y = Math.min(line.begin.y, line.end.y); y <= Math.max(line.begin.y, line.end.y); ++y)
        this.map[y][line.begin.x] += 1;
    }
  }
}

let map = new DiscreteMap();

forEachLine(localAssetPath(import.meta, 'input.txt'), function(line){
  map.drawLine(new Line(line));
}).then(function(){
  const crosses = map.map.reduce(function(count, row) {
    return count + row.reduce((c, v) => v > 1 ? c + 1 : c, 0);
  }, 0)
  console.log(`Number of crosses: ${crosses}`);
  console.assert(crosses == 4873, "Expected 4873");
});
