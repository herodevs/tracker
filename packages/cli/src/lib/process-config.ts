import { Config } from './models/config';
import { ProcessResult } from './models/process-result';
import { processCategory } from './process-category';
import { format } from 'date-fns';

export function processConfig(
  config: Config,
  rootDirectory: string
): ProcessResult {
  console.log(`Starting...`);
  const categoryResults = Object.entries(config.categories).map(
    ([name, category]) =>
      processCategory(
        rootDirectory,
        { ...category, name },
        config.ignorePatterns || []
      )
  );
  return {
    timestamp: format(new Date(), 'yyyy-MM-dd-HH-mm-ss-SSS'),
    categories: categoryResults,
  };
}
