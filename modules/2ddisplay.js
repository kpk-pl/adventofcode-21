export class Line {
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

  diagonal() {
    return Math.abs(this.begin.x - this.end.x) == Math.abs(this.begin.y - this.end.y);
  }

  *[Symbol.iterator]() {
    let point = this.begin;
    while (point.x != this.end.x || point.y != this.end.y) {
      yield point;

      function towards(point, target) {
        if (point > target)
          return point - 1;
        if (point < target)
          return point + 1;
        return point;
      }

      point = {
        x: towards(point.x, this.end.x),
        y: towards(point.y, this.end.y)
      };
    }

    yield this.end;
  }
}

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class DiscreteMap {
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
    else if (obj instanceof Point) {
      this.resizeHeight(obj.y + 1);
      this.resizeWidth(obj.x + 1);
    }
  }

  drawLine(line) {
    this.resizeFor(line);

    for (let point of line)
      this.map[point.y][point.x] += 1;
  }

  drawPoint(point) {
    this.resizeFor(point);
    this.map[point.y][point.x] += 1;
  }
}

