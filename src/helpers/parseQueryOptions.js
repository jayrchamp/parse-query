import { isPlainObject } from '..//utils'
import merge from "lodash/merge";
import reduce from "lodash/reduce";

const _ = {
  isPlainObject,
  reduce,
  merge
}

function validateObjectKeys(obj) {
  // Retrieve all the keys of the object
  const keys = Object.keys(obj);
  const validKeys = [];

  // Iterate over each key to check for validation
  for (const key of keys) {
    // Check if the key starts or ends with a dot
    if (key.startsWith('.') || key.endsWith('.')) {
      validKeys.push(key);
    }
  }

  // Return true if all keys are valid
  return validKeys;
}


function parseQueryOptions(queryOptions) {
  let options = {}

  const invalidKeys = validateObjectKeys(queryOptions)
  if (invalidKeys.length > 0) {
    throw new Error(`[@jayrchamp/parse-query] Invalid query option keys: ->  ${invalidKeys.join(' | ')}  <-`)
  }

  if (_.isPlainObject(queryOptions) && Object.keys(queryOptions).length > 0) {
    Object.keys(queryOptions).forEach(key => {
      const queryOptionsItem = _.reduce(queryOptions[key], (result, v, k) => {
        result[`_${k}`] = v
        return result
      }, {})

      queryOptionsItem['_key'] = key

      const keyParts = key.split('.')
      if (keyParts.length > 0) {
        options = _.merge(
          options,
          listToTree(keyParts, queryOptionsItem)
        )
      }
    })
  }
  return options
}

function listToTree(list, obj) {
  let result = {};
  const length = list.length;
  list.reduce((object, value, k) => {
    // const key = _.camelCase(value)
    const key = value
    if (!object.hasOwnProperty(key)) {
      object[key] = length <= k + 1 ? obj : {};
    }
    return object[key];
  }, result);
  return result;
}

export default parseQueryOptions