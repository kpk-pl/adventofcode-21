'use strict';

import { createReadStream } from 'fs';
import { createInterface as createReadlineInterface } from 'readline';

export async function reduceLines(name, handler, init) {
  const fileStream = createReadStream(name, 'utf8');
  const rl = createReadlineInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let result = init;
  for await (const line of rl) {
    result = handler(result, line);
  }

  return result;
}

export async function forEachLine(name, handler) {
  const fileStream = createReadStream(name, 'utf8');
  const rl = createReadlineInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    handler(line);
  }
}
