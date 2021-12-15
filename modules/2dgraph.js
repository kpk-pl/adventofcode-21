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
        x: colIdx,
        y: rowIdx,
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

  display() {
    function repr(value) {
      if (value == 0)
        return ' ';
      if (value > 9)
        return '&';
      return String(value);
    }
    return this.graph.map(row => row.reduce((acc, n) => acc + repr(n.value), '')).join('\n');
  }
}

export function bfs(start, cond, action) {
  let remaining = [start].flat();
  let visited = 0;

  while (remaining.length > 0) {
    let node = remaining.shift();
    if (! cond(node))
      continue;

    action(node);

    for (let n of node.adjacent)
      if (cond(n.link))
        remaining.push(n.link);

    visited += 1;
  }

  return visited;
}

export function dijkstra(start, end, opts) {
  opts = opts || {};

  const hash = (node) => `${node.x},${node.y}`;

  let visited = Object.create(null);
  visited[hash(start)] = 0;

  let stack = [{node: start, cost: 0}];

  function pushStack(element) {
    // This could be writted as a binary search + splice but not now
    stack.push(element);
    stack.sort((l, r) => l.cost - r.cost);
  }

  loop: while (stack.length > 0) {
    const element = stack.shift();
    for (let neighbor of element.node.adjacent) {
      const nbCost = element.cost + neighbor.link.value;
      const nbHash = hash(neighbor.link);

      if (neighbor.link === end) {
        visited[nbHash] = nbCost;
        break loop;
      }

      if (nbHash in visited) {
        if (visited[nbHash] > nbCost)
          visited[nbHash] = nbCost;
      }
      else {
        pushStack({node: neighbor.link, cost: nbCost});
        visited[nbHash] = nbCost;
      }
    }
  }

  function backTrack() {
    let path = [end];

    while (path[0] !== start) {
      const myHash = hash(path[0]);
      for (let neighbor of path[0].adjacent) {
        const nbHash = hash(neighbor.link);
        if (nbHash in visited && visited[nbHash] == visited[myHash] - path[0].value) {
          path.unshift(neighbor.link);
          break;
        }
      }
    }

    return path;
  }

  if (opts.path)
    return {path: backTrack(), cost: visited[hash(end)]};
  else
    return {cost: visited[hash(end)]};
}
