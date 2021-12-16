#!/usr/bin/env node

'use strict';

import readlines from 'n-readlines';
import { localAssetPath, localPath } from '../modules/fs.js'

let input = new readlines(localAssetPath(import.meta, 'input.txt'));
const program = input.next().toString('ascii');
const binaryProgram = program.split('').map(function(x){
  let b = parseInt(x, 16).toString(2);
  while (b.length < 4) b = '0' + b;
  return b;
}).join('');

function parseLiteral(p) {
  let literal = '';
  let consumed = 0;
  while (true) {
    consumed += 5;
    literal += p.substr(1, 4);
    if (p[0] == '0')
      break;
    p = p.substr(5);
  }

  return { payload: { literal: parseInt(literal, 2) }, consumed: consumed };
}

function parseOperator(p) {
  const lengthId = p[0];
  let lenPackets, consumed = 0;
  if (lengthId == '0') {
    lenPackets = Infinity;
    const lenBits = parseInt(p.substr(1, 15), 2);
    p = p.substr(16, lenBits);
    consumed += 16;
  }
  else {
    lenPackets = parseInt(p.substr(1, 11), 2);
    p = p.substr(12);
    consumed += 12;
  }

  let tokens = [];
  while (lenPackets > 0 && p.length > 0) {
    const subToken = parseToken(p);
    tokens.push(subToken.token);

    p = p.substr(subToken.consumed);
    lenPackets -= 1;
    consumed += subToken.consumed;
  }

  return { payload: { tokens: tokens }, consumed: consumed };
}

function parseToken(p) {
  let token = {
    version: parseInt(p.substr(0, 3), 2),
    typeId: parseInt(p.substr(3, 3), 2)
  };

  let payload;
  if (token.typeId == 4)
    payload = parseLiteral(p.substr(6));
  else
    payload = parseOperator(p.substr(6));

  token.payload = payload.payload;

  return {token: token, consumed: payload.consumed + 6};
}

function tokenize(p) {
  return parseToken(p).token;
}

const mainToken = tokenize(binaryProgram);
//console.log(JSON.stringify(mainToken));

function execute(token) {
  if (token.typeId == 0)
    return token.payload.tokens.reduce((acc, v) => acc + execute(v), 0);
  else if (token.typeId == 1)
    return token.payload.tokens.reduce((acc, v) => acc * execute(v), 1);
  else if (token.typeId == 2)
    return token.payload.tokens.reduce((acc, v) => Math.min(acc, execute(v)), Infinity);
  else if (token.typeId == 3)
    return token.payload.tokens.reduce((acc, v) => Math.max(acc, execute(v)), -Infinity);
  else if (token.typeId == 4)
    return token.payload.literal;
  else if (token.typeId == 5)
    return Number(execute(token.payload.tokens[0]) > execute(token.payload.tokens[1])).valueOf();
  else if (token.typeId == 6)
    return Number(execute(token.payload.tokens[0]) < execute(token.payload.tokens[1])).valueOf();
  else if (token.typeId == 7)
    return Number(execute(token.payload.tokens[0]) == execute(token.payload.tokens[1])).valueOf();
}

const result = execute(mainToken);

console.log(`${localPath(import.meta)}: Result: ${result}`);
console.assert(result == 333794664059, "Expected 333794664059");
