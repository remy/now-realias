#!/usr/bin/env node

function main(alias) {
  const Now = require('now-client');
  const now = Now(); // this detects the token from ~/.now.json or the env automatically
  const pkg = require(process.cwd() + '/package.json');

  return now.getDeployments().then(res => {
    const [latest, ...releases] = res.filter(_ => _.name === pkg.name).sort((a, b) => b.created - a.created);

    if (!releases.length) {
      throw new Error('no previous build found to realias to');
    }

    if (alias) {
      console.log(`manually aliasing to ${alias}...`);
      return now.createAlias(latest.uid, alias);
    } else {
      return getAliases(now, releases).then(res => {
        const first = res.shift(); // expecting a single alias - otherwise ¯\_(ツ)_/¯
        console.log(`aliasing to ${first.alias}...`);
        return now.createAlias(latest.uid, first.alias);
      });
    }

  });
}

function getAliases(now, array) {
  const key = array[0];

  if (!key) {
    Promise.reject('No aliases found');
  }

  console.log(`getting alias for ${key.uid} (${key.url})`);

  return now.getAliases(key.uid).then(res => {
    if (res.length) {
      console.log('none found, trying next.');
      return res;
    }

    return getAliases(now, array.slice(1));
  });
}


module.exports = main;

if (!module.parent) {
  main(process.argv[2]).then(() => console.log('done')).catch(e => console.error(e));
}
