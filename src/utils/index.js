export const isFunction = (item) => typeof item === 'function'
export const isPlainObject = (item) => typeof item === 'object' && !Array.isArray(item) && item !== null
export const isArray = (item) => Array.isArray(item)
export const isFilledObject = (item) => isPlainObject(item) && Object.keys(item).length > 0
export const isFilledArray = (item) => isArray(item) && item.length > 0
export const isLiteral = (item) => !isPlainObject(item) && !isArray(item) && !isFunction(item) && item !== undefined && item !== null
export const size = (item) => {
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

export const isNativeArrayFn = (fn) => {
  try {
    // Case 1: No arguments or undefined should create an empty array
    if (!Array.isArray(fn()) || !Array.isArray(fn(undefined))) {
      return false;
    }

    // Case 2: Single numeric argument should create an array of that length
    const lengthTest = 3;
    const arrayLengthTest = fn(lengthTest);
    if (!Array.isArray(arrayLengthTest) || arrayLengthTest.length !== lengthTest) {
      return false;
    }

    // Case 3: Multiple arguments should create an array with those items
    const items = [1, 'a', {}];
    const arrayItemsTest = fn(...items);
    if (!Array.isArray(arrayItemsTest) || arrayItemsTest.length !== items.length) {
      return false;
    }

    // Additional check: All elements in the array should match the items
    for (let i = 0; i < items.length; i++) {
      if (arrayItemsTest[i] !== items[i]) {
        return false;
      }
    }

    return true;
  } catch (e) {
    // If an error occurs, it's not the native Array
    return false;
  }
};