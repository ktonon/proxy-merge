const proxyMerge = (...objects) => {
  const extra = objects.slice(1);

  return new Proxy(objects[0], {
    get: (target, name) => {
      if (name === '__proxyMerged__') { return objects; }
      const obj = extra.find(o => o[name]);
      return obj
        ? obj[name]
        : target[name];
    },
  });
};

const h = {};
h.getProxified = (p) => {
  const objects = p && p.__proxyMerged__;
  return objects === undefined
    ? [p]
    : objects.reduce((acc, obj) => acc.concat(h.getProxified(obj)), []);
};

proxyMerge.flatten = (...args) => {
  const objects = h.getProxified({ __proxyMerged__: args });
  return Object.assign(...[{}].concat(objects));
};

module.exports = proxyMerge;
