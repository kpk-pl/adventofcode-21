'use strict';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import rootPath from 'app-root-path'

export function localAssetPath(meta, name) {
  return resolve(dirname(fileURLToPath(meta.url)), name);
}

export function localPath(meta) {
  return fileURLToPath(meta.url).slice(rootPath.toString().length + 1);
}
