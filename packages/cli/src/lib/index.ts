import { resolve } from 'path';
import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { processConfig } from './process-config';
import { initialize } from './initialize';
import { getTheRootDirectory, readConfig, saveResults } from './util';

interface Args {
  root?: string;
  config?: string;
  init?: boolean;
}

export function run() {
  const argv: Args = yargs(hideBin(global.process.argv)).argv as Args;
  const localRootDir = getTheRootDirectory(global.process.cwd());

  if (argv.init) {
    initialize(localRootDir);
    return;
  }

  const rootDirectory = argv.root ? resolve(argv.root) : localRootDir;
  const config = readConfig(localRootDir, argv.config);

  const results = processConfig(config, rootDirectory);

  saveResults(localRootDir, config.outputDir, results);
}

run();
