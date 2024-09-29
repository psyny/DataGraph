export {Definitions}

import { definitions as backenddefs } from './backend.js';
import { definitions as frontenddefs } from './frontend.js';

// TODO: make one define

let defitions = mergeObjects(frontenddefs, backenddefs);

class Definitions {
    static getDefinitions() {
      return defitions
    }
}

function mergeObjects(objA, objB) {
  const objC = {};

  // Helper function to determine if a value is an object
  function isObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
  }

  // Iterate over keys in objA
  for (let key in objA) {
    if (isObject(objA[key]) && isObject(objB[key])) {
      // If both objA and objB have the same key and both values are objects, merge them recursively
      objC[key] = mergeObjects(objA[key], objB[key]);
    } else {
      // Otherwise, use objA's value
      objC[key] = objA[key];
    }
  }

  // Iterate over keys in objB
  for (let key in objB) {
    if (isObject(objB[key]) && isObject(objA[key])) {
      // If both objA and objB have the same key and both values are objects, merge them recursively
      objC[key] = mergeObjects(objA[key], objB[key]);
    } else {
      // If key exists in both, prefer objB's value
      objC[key] = objB[key];
    }
  }

  return objC;
}