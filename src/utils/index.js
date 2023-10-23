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

export const getType = (typeFn) => {
  if (typeof typeFn !== 'function') {

    if (typeof typeFn === 'object' && isArray(typeFn)) {
      return 'array'
    } else if (typeof typeFn === 'object') {
      return 'object'
    }

    return typeof typeFn
  }
  if (typeof typeFn() === 'object' && isArray(typeFn())) {
    return 'array'
  } 
  return typeof typeFn()
}

export const isNumber = (value) => {
  if (typeof value === 'number') {
    return true;
  } else if (typeof value === 'string') {
    // Check if the string is a valid representation of a number
    return !isNaN(value) && !isNaN(parseFloat(value));
  }
  return false;
}

export const isNativeNumberFn = (fn) => fn('') === 0 && fn(null) === 0 && isNaN(fn(undefined)) && fn('123') === 123;
