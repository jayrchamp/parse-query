import isUndefined from 'lodash/isUndefined'
import keys from 'lodash/keys'
import has from 'lodash/has'
import get from 'lodash/get'
import entries from 'lodash/entries'
import isEqual from 'lodash/isEqual'
import isObjectLike from 'lodash/isObjectLike'
const _ = {
  isUndefined,
  keys,
  has,
  get,
  entries,
  isEqual,
  isObjectLike
}

function deepDiff(fromObject, toObject) {
  const changes = {}

  const buildPath = (path, obj, key) =>
    _.isUndefined(path) ? key : `${path}.${key}`

  const walk = (fromObject, toObject, path) => {
    for (const key of _.keys(fromObject)) {
      const currentPath = buildPath(path, fromObject, key)
      if (!_.has(toObject, key)) {
        changes[currentPath] = { from: _.get(fromObject, key) }
      }
    }

    for (const [key, to] of _.entries(toObject)) {
      const currentPath = buildPath(path, toObject, key)
      if (!_.has(fromObject, key)) {
        changes[currentPath] = { to }
      } else {
        const from = _.get(fromObject, key)
        if (!_.isEqual(from, to)) {
          if (_.isObjectLike(to) && _.isObjectLike(from)) {
            walk(from, to, currentPath)
          } else {
            changes[currentPath] = { from, to }
          }
        }
      }
    }
  }

  walk(fromObject, toObject)

  return changes
}

export default deepDiff
