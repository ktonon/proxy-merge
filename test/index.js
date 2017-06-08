const should = require('should');

const proxyMerge = require('../src');

describe('proxyMerge(...object)', () => {
  it('returns the same object if only one is provided', () => {
    const a = {};
    proxyMerge(a).should.equal(a);
    should(a.__proxyMerged__).be.undefined();
  });

  it('works with one object', () => {
    const p0 = proxyMerge({ foo: 'bar' });
    should(p0.foo).equal('bar');
  });

  it('works with two objects', () => {
    const p0 = proxyMerge({ foo: 'bar' }, { age: 5 });
    should(p0.foo).equal('bar');
    should(p0.age).equal(5);
    should(p0.__proxyMerged__).not.be.undefined();
  });

  it('works with many objects', () => {
    const p0 = proxyMerge({ foo: 'bar' }, { age: 5 }, { where: 'far' }, { here: 'there' });
    should(p0.foo).equal('bar');
    should(p0.age).equal(5);
    should(p0.where).equal('far');
    should(p0.here).equal('there');
  });

  it('only keys from first object are listed with Object.keys(...)', () => {
    const p0 = proxyMerge({ foo: 'bar' }, { age: 5 });
    Object.keys(p0).should.deepEqual(['foo']);
    should(p0).deepEqual({ foo: 'bar' });
  });

  it('the first input is not the same object as the output', () => {
    const i0 = { foo: 'bar' };
    const i1 = { age: 5 };
    const p0 = proxyMerge(i0, i1);
    should(p0).not.equal(i0);
  });

  it('changes to the input are picked up by the proxy-merged object', () => {
    const i0 = { foo: 'bar' };
    const i1 = { age: 5 };
    const p0 = proxyMerge(i0, i1);
    i0.change0 = 0;
    i1.change1 = 1;
    should(p0.change0).equal(0);
    should(p0.change1).equal(1);
  });

  it('objects listed last take precedence', () => {
    const p0 = proxyMerge({ foo: 'bar' }, { foo: 'car' });
    should(p0.foo).equal('car');
  });

  it('can take a previously merged object as input', () => {
    const p0 = proxyMerge({ one: 1 }, { two: 2 });
    const p1 = proxyMerge(p0, { three: 3 });
    should(p1.one).equal(1);
    should(p1.two).equal(2);
    should(p1.three).equal(3);
  });

  describe('.flatten(proxyMergedObj)', () => {
    it('returns a simple object which does use a proxy', () => {
      const p0 = proxyMerge({ foo: 'bar' }, { age: 5 });
      const f0 = proxyMerge.flatten(p0);
      f0.should.deepEqual({
        foo: 'bar',
        age: 5,
      });
      should(f0.__proxyMerged__).be.undefined();
    });

    it('works recursively', () => {
      const p0 = proxyMerge({ foo: 'bar' }, { age: 5 });
      const p1 = proxyMerge({ height: 3 }, p0);
      const p2 = proxyMerge({ car: 'big' }, p1);
      proxyMerge.flatten(p2).should.deepEqual({
        car: 'big',
        foo: 'bar',
        age: 5,
        height: 3,
      });
    });

    it('can take more than one argument', () => {
      const obj = proxyMerge.flatten({ foo: 'bar' }, { age: 5 });
      obj.should.deepEqual({
        foo: 'bar',
        age: 5,
      });
    });

    it('works with objects merged multiple times', () => {
      const p0 = proxyMerge({ one: 1 }, { two: 2 });
      const p1 = proxyMerge(p0, { three: 3 });
      proxyMerge.flatten(p1).should.deepEqual({
        one: 1,
        two: 2,
        three: 3,
      });
    });

    it('changes to the input are not picked up by the flattened object', () => {
      const i0 = { foo: 'bar' };
      const i1 = { age: 5 };
      const p0 = proxyMerge(i0, i1);
      i0.change0 = 0;
      i1.change1 = 1;
      should(p0.change0).equal(0);
      should(p0.change1).equal(1);
      const flat = proxyMerge.flatten(p0);
      i0.change2 = 2;
      Object.keys(flat).sort().should.deepEqual(['age', 'change0', 'change1', 'foo']);
      flat.should.deepEqual({
        foo: 'bar',
        age: 5,
        change0: 0,
        change1: 1,
      });
    });
  });
});
