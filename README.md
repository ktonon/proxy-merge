# proxy-merge

[![npm version](https://img.shields.io/npm/v/proxy-merge.svg)](https://www.npmjs.com/package/proxy-merge)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/ktonon/proxy-merge/blob/master/LICENSE.txt)
[![CircleCI](https://img.shields.io/circleci/project/github/ktonon/proxy-merge.svg)](https://circleci.com/gh/ktonon/proxy-merge)
[![Coverage Status](https://coveralls.io/repos/github/ktonon/proxy-merge/badge.svg?branch=master)](https://coveralls.io/github/ktonon/proxy-merge?branch=master)

Merge one or more objects using [Proxy][]. Flatten a proxy-merged object to remove the proxy.

```shell
npm install -S proxy-merge
```

## Examples

```javascript
const proxyMerge = require('proxy-merge');
```

Merge two (or more...) objects.

```javascript
const input0 = { foo: 'bar' };
const input1 = { age: 5 };
const obj = proxyMerge(input0, input1);
obj.foo; // => 'bar'
obj.age; // => 5
```

Only keys from the first input are listed with [Object.keys(obj)][]...

```javascript
Object.keys(obj); // => ['foo']
```

...but, the first input is not the output object.

```javascript
input0 === obj; // => false
```

Changes made to the input after merging will be reflected by the proxy-merged object.

```javascript
input0.change0 = 0;
input1.change1 = 1;
obj.change0; // => 0
obj.change1; // => 1
```

If you need a vanilla `Object`, use `.flatten(obj)`.

```javascript
const flat = proxyMerge.flatten(obj);
Object.keys(flat).sort(); // ['age', 'change0', 'change1', 'foo']
flat.age; // => 5
```

Changes made to the inputs are not reflected in the flattened object.

```javascript
input0.change2 = 2;
obj.change2; // => 2
flat.change2; // => undefined
```

[Object.keys(obj)]:https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
[Proxy]:https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
