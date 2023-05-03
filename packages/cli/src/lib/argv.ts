import yargs = require('yargs');
import { ChartConfig } from './models/chart-config';
import { hideBin } from 'yargs/helpers';

interface RawArgs {
  root?: string;
  config?: string;
  init?: boolean;
  chart?: ChartConfig
}

export interface Args extends RawArgs {
  chart: ChartConfig
}

const parsedArgv: RawArgs = yargs(hideBin(global.process.argv)).argv as RawArgs;

// set a default chart config instance from cli options
parsedArgv.chart = new ChartConfig(parsedArgv.chart);

export const argv = parsedArgv as Args;
