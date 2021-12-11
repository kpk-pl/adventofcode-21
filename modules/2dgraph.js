import * as fs from 'fs';

export class Graph {
  constructor(file, opts) {
    const input = fs.readFileSync(file, "ascii").split('\n').filter(x => Boolean(x));

    this.height = input.length;
    this.width = input[0].length;

    let self = this;
    this.graph = input.map((row, rowIdx) => row.split('').map(function(cell, colIdx){
      let adjacent = [];

      if (opts && opts.adjacency) {
        if (opts.adjacency.n && rowIdx > 0)
          adjacent.push({x: colIdx, y: rowIdx-1});
        if (opts.adjacency.ne && rowIdx > 0 && colIdx < self.width-1)
          adjacent.push({x: colIdx+1, y: rowIdx-1});
        if (opts.adjacency.e && colIdx < self.width-1)
          adjacent.push({x: colIdx+1, y: rowIdx});
        if (opts.adjacency.se && rowIdx < self.height-1 && colIdx < self.width-1)
          adjacent.push({x: colIdx+1, y: rowIdx+1});
        if (opts.adjacency.s && rowIdx < self.height-1)
          adjacent.push({x: colIdx, y: rowIdx+1});
        if (opts.adjacency.sw && rowIdx < self.height-1 && colIdx > 0)
          adjacent.push({x: colIdx-1, y: rowIdx+1});
        if (opts.adjacency.w && colIdx > 0)
          adjacent.push({x: colIdx-1, y: rowIdx});
        if (opts.adjacency.nw && rowIdx > 0 && colIdx > 0)
          adjacent.push({x: colIdx-1, y: rowIdx-1});
      }

      return {
        value: Number(cell),
        adjacent: adjacent
      };
    }));

    this.graph.flat().forEach(n => n.adjacent.forEach(a => a.link = self.at(a.x, a.y)));
  }

  at(x, y) {
    return this.graph[y][x];
  }

  flat() {
    return this.graph.flat();
  }
}
