import { ProcessResult } from './models/process-result';
import {
  getGitCommit,
  getTheRootDirectory,
  readConfig,
  saveResults,
} from './util';
import * as fs from 'fs';

jest.mock('fs', () => {
  return {
    existsSync: jest.fn().mockImplementation((p) => {
      switch (p) {
        case '/a/package.json':
          return true;
        case '/custom/dir/something.json':
          return true;
        case '/x/z/data.json':
          return true;
        default:
          return false;
      }
    }),
    readFileSync: jest.fn().mockImplementation((p) => {
      switch (p) {
        case '/hd-tracker/data.json':
          return JSON.stringify({
            prop: 'value',
          });
        case '/custom/dir/something.json':
          return JSON.stringify({
            customProp: 'custom value',
          });
        case '/x/z/data.json':
          return JSON.stringify([]);
      }
    }),
    writeFileSync: jest.fn(),
  };
});

jest.mock('git-last-commit', () => {
  return {
    getLastCommit: (f) => {
      f(null, {
        hash: 'abc123',
        committedOn: '1437988060',
      });
    },
  };
});

describe('util', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fs.writeFileSync as any).mockReset();
  });

  describe('getTheRootDirectory', () => {
    it('should get the project root directory when it is the root directory', () => {
      const result = getTheRootDirectory('/a');
      expect(result).toEqual('/a');
    });

    it('should get the project root directory from a child directory', () => {
      const result = getTheRootDirectory('/a/b/c');
      expect(result).toEqual('/a');
    });
  });

  describe('readConfig', () => {
    it('should read the config file', () => {
      const result = readConfig('/');
      expect(result).toEqual({ prop: 'value' });
    });

    it('should read a custom config file', () => {
      const result = readConfig('/', '/custom/dir/something.json');
      expect(result).toEqual({ customProp: 'custom value' });
    });
  });

  describe('saveResults', () => {
    let localRootDir: string;
    let outputDir: string;
    let results: ProcessResult;

    beforeEach(() => {
      localRootDir = '/x/';
      outputDir = 'z';
      results = {
        timestamp: 'now',
        hash: 'abc123',
        categories: [],
      };
    });

    it('should write out the data to an existing data.json', () => {
      saveResults(localRootDir, outputDir, results);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/x/z/data.json',
        JSON.stringify([results], null, 2)
      );
    });

    it('should write out the data to a non-existing data.json', () => {
      saveResults(localRootDir, 'empty', results);
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/x/empty/data.json',
        JSON.stringify([results], null, 2)
      );
    });
  });

  describe('getGitCommit', () => {
    it('should get the hash from the current commit', async () => {
      const result = await getGitCommit();
      expect(result.hash).toEqual('abc123');
    });

    it('should get a formatted date from the current commit', async () => {
      const result = await getGitCommit();
      expect(result.timestamp).toMatch(
        /\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{3}/
      );
    });
  });
});
