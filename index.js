#!/usr/bin/env node
function main() {
  const Now = require('now-client');
  const now = Now(); // this looks like it detect the token from ~/.now.json or the env automatically
  const pkg = require(process.cwd() + '/package.json');

  return now.getDeployments().then(res => {
    const [latest, prev, ...rest] = res.filter(_ => _.name === pkg.name).sort((a, b) => b.created - a.created);

    if (!prev) {
      throw new Error('no previous build found to realias to');
    }

    console.log(`getting alias for ${prev.uid} (${prev.url})`);
    return now.getAliases(prev.uid).then(res => {
      const first = res.shift(); // expecting a single alias - otherwise ¯\_(ツ)_/¯
      console.log(`aliasing to ${first.alias}...`);
      return now.createAlias(latest.uid, first.alias);
    });
  });
}

module.exports = main;

if (!module.parent) {
  main().then(() => console.log('done')).catch(e => console.error(e));
}
