const tap = require('tap');
const test = tap.test;
const sinon = require('sinon');
const spies = {
  getAliases: null,
  createAlias: null,
};

const proxyquire = require('proxyquire');
const main = proxyquire('../', {
  [process.cwd() + '/package.json']: {
    name: 'test'
  },
  'now-client': () => {
    return {
      getDeployments() {
        return Promise.resolve(spies.getDeployments());
      },
      getAliases(id) {
        return Promise.resolve(spies.getAliases(id));
      },
      createAlias(id, alias) {
        return Promise.resolve(spies.createAlias(id, alias));
      },
    };
  }
});

tap.beforeEach(done => {
  spies.getAliases = sinon.spy();
  spies.createAlias = sinon.spy();
  spies.getDeployments = sinon.spy();
  done();
});

test('now realias', t => {
  spies.getDeployments = sinon.spy(() => [{
    uid: 2,
    name: 'test'
  }, {
    uid: 1,
    name: 'test'
  }]);

  spies.getAliases = sinon.spy(() => [{ alias: 'test.com' }]);
  return main().then(() => {
    t.deepEqual(spies.createAlias.args[0], [ 2, 'test.com' ]);
  });
});

test('now realias with given alias', t => {
  spies.getDeployments = sinon.spy(() => [{
    uid: 2,
    name: 'test'
  }, {
    uid: 1,
    name: 'test'
  }]);

  return main('someAlias').then(() => {
    t.deepEqual(spies.createAlias.args[0], [ 2, 'someAlias' ]);
  });
});
