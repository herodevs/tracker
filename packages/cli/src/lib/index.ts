import { resolve } from 'path';
import { processConfig } from './process-config';
import { initialize } from './initialize';
import { createDataVizIn, getData, getTheRootDirectory, readConfig, saveResults } from './util';
import { argv } from './argv';


(async function run() {

  const localRootDir = getTheRootDirectory(global.process.cwd());

  if (argv.init) {
    initialize(localRootDir);
    return;
  }

  const rootDirectory = argv.root ? resolve(argv.root) : localRootDir;
  const config = readConfig(localRootDir, argv.config);

  const results = await processConfig(config, rootDirectory);

  saveResults(localRootDir, config.outputDir, results);

  
  const allData = getData(localRootDir, config.outputDir);

  const parentDir = resolve(localRootDir, config.outputDir);

  await createDataVizIn(parentDir, allData);
}());
