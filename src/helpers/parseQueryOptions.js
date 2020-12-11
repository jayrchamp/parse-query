import { isPlainObject } from '..//utils'
import merge from "lodash/merge";
import reduce from "lodash/reduce";

const _ = {
  isPlainObject,
  reduce,
  merge
}


function parseQueryOptions (queryOptions) {
  let options = {}
  if (_.isPlainObject(queryOptions) && Object.keys(queryOptions).length > 0) {
    Object.keys(queryOptions).forEach(key => {
      Object.keys(queryOptions)


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