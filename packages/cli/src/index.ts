#!/usr/bin/env node

(async function run() {
  console.warn(`This package (@herodevs/hd-tracker) has been deprecated`);
  const messageLines = [
    '',
    'It is now available as part of the HeroDevs CLI (@herodevs/cli) via:',
    'npx @herodevs/cli tracker init',
    'and',
    'npx @herodevs/cli tracker run',
  ];
  console.log(messageLines.join('\n'));
})();
