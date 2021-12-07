#!/usr/bin/env node

'use strict';

import { reduceLines } from '../modules/input.js';
import { localAssetPath, localPath } from '../modules/fs.js'

function gatherReport(report, line) {
  return report.concat(line);
}

function countBits(report, position) {
  const ones = report.reduce((count, pattern) => pattern[position] == '1' ? count + 1 : count, 0);
  let result = {'0': report.length - ones, '1': ones};
  return result;
}

function mostCommonBit(counts) {
  if (counts['1'] >= counts['0'])
    return '1';
  return '0';
}

function leastCommonBit(counts) {
  if (counts['0'] <= counts['1'])
    return '0';
  return '1';
}

function calculateLifeSupport(report, algorithm) {
  for (let pos = 0; report.length > 1; ++pos) {
    const counts = countBits(report, pos);
    const preference = algorithm(counts);
    report = report.filter(pattern => pattern[pos] == preference);
  }

  return parseInt(report[0], 2);
}

reduceLines(localAssetPath(import.meta, 'input.txt'), gatherReport, [])
  .then(function(report){
    const oxygenGeneratorRaring = calculateLifeSupport(report, mostCommonBit);
    const co2ScrubberRating = calculateLifeSupport(report, leastCommonBit);
    console.log(`Oxygen generation rating: ${oxygenGeneratorRaring}, CO2 scrubber rating: ${co2ScrubberRating}`);
    console.assert(oxygenGeneratorRaring * co2ScrubberRating == 4406844, "Expected 4406844");
  });
