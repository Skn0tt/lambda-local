/*
 * This file is a TypeScript version of
 * https://github.com/dwyl/decache/blob/main/decache.js
 * with no comments.
 */

const path = require('path');

export function decache(moduleName) {
  moduleName = require.resolve(moduleName);

  if (!moduleName) { return; }
  searchCache(moduleName, function (mod) {
    delete require.cache[mod.id];
  });
  // @ts-ignore
  Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
    if (cacheKey.indexOf(moduleName) > -1) {
      // @ts-ignore
      delete module.constructor._pathCache[cacheKey];
      console.log(cacheKey);
    }
  });
};

function searchCache(moduleName, callback) {
  var visited = {};

  if (moduleName) {
    const mod = require.cache[moduleName];
    (function run(current) {
      if(!current) return;
      visited[current.id] = true;
      current.children.forEach(function (child) {
        if (path.extname(child.filename) !== '.node' && !visited[child.id]) {
          run(child);
        }
      });
      callback(current);
    })(mod);
  }
};