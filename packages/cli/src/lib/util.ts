import { resolve, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Config } from './models/config';
import { ProcessResult } from './models/process-result';

export function getTheRootDirectory(directory: string): string {
  if (existsSync(join(directory, 'package.json'))) {
    return directory;
  }
  return getTheRootDirectory(resolve(join(directory, '..')));
}

export function readConfig(
  rootDirectory: string,
  optionsPath?: string
): Config {
  const path =
    optionsPath && existsSync(join(rootDirectory, optionsPath))
      ? join(rootDirectory, optionsPath)
      : join(rootDirectory, 'hd-tracker', 'data.json');

  const contents = readFileSync(path).toString('utf-8');

  return JSON.parse(contents);
}

export function saveResults(
  localRootDir: string,
  outputDir: string,
  results: ProcessResult
): void {
  console.log('Outputting file');
  const outputPath = resolve(join(localRootDir, outputDir, 'data.json'));
  let contents = '';
  if (existsSync(outputPath)) {
    contents = readFileSync(outputPath).toString('utf-8');
  }
  const output: ProcessResult[] = contents === '' ? [] : JSON.parse(contents);
  if (!Array.isArray(output)) {
    console.error('Invalid output file format');
  }
  output.push(results);
  const outputText = JSON.stringify(output, null, 2);
  writeFileSync(outputPath, outputText);
  console.log(`Output written to: ${outputPath}`);
}
