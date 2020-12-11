export const isFunction = (item) => typeof item === 'function'
export const isPlainObject = (item) => typeof item === 'object' && !Array.isArray(item) && item !== null
export const isArray = (item) => Array.isArray(item)
export const isFilledObject = (item) => isPlainObject(item) && Object.keys(item).length > 0
export const isFilledArray = (item) => isArray(item) && item.length > 0
export const isLiteral = (item) => !isPlainObject(item) && !isArray(item) && !isFunction(item) && item !== undefined && item !== null
export const size  = (item) => {
  if (isPlainObject(item)) {
    return Object.keys(item).length
  } else if (isArray(item) || isLiteral(item)) {
    return item.length
  } else {
    return 0
  }
}

export const hasProp = (item, prop) => isFilledObject(item) && item.hasOwnProperty(prop)