import has from 'lodash/has'
import get from 'lodash/get'
import set from 'lodash/set'
import size from 'lodash/size'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import { isPlainObject, isArray, isFilledObject, isNumber, isNativeNumberFn, getType } from '../utils'

class QueryStringParser {
  constructor (routeQuery, queryOptions, ctx, options) {
    this.routeQuery = routeQuery
    this.queryOptions = queryOptions
    this.ctx = ctx
    this.result = {}
    this.errors = []
    this.options = Object.assign({
      debug: false
    }, options)
  }

  parse () {
    this.result = this._recursivelyParse(this.routeQuery, this.queryOptions)
  }

  getResult () {
    return this.result
  }

  getErrors () {
    return this.errors
  }

  /**
   * _recursivelyParse
   * 
   * @param {*} routeQuery 
   * @param {*} queryOptions 
   * @param {*} query 
   * @param {*} parentKey 
   */
  _recursivelyParse (routeQuery, queryOptions, query = {}, parentKey = '') {
    if (isFilledObject(routeQuery)) {
      query = this._recursivelyParseObject(routeQuery, queryOptions, query, parentKey)
    } 
    // else if (isArray(routeQuery)) {

    //   if (!query[parentKey]) {
    //     query = []
    //   }

    //   forEach(routeQuery, (o, i) => {
    //     query[i] = this._recursivelyParse(o, queryOptions, query, parentKey + '.' + i)
    //   })
    // }

    return query
  }

  _recursivelyParseObject (routeQuery, queryOptions, query = {}, parentKey = '') {
    return Object.keys(routeQuery).reduce((result, prop, i) => {
      // console.log('\n')
      // console.log( prop )


      const isValidProp = this._validateProp(routeQuery, queryOptions, prop, parentKey)

      // console.log( 
      //   'isValidProp', isValidProp
      //  )
      // console.log('\n')

      if (!isValidProp) return result

      if (isPlainObject(routeQuery[prop])) {
        this._parseObject(prop, result, query, routeQuery, queryOptions)
      } else if (isArray(routeQuery[prop])) {
        this._parseArray(prop, parentKey, result, query, routeQuery, queryOptions)
      } else {
        this._parseLiteral(prop, parentKey, result, query, routeQuery, queryOptions)
      } 

      return result
    }, {})
  }

  /**
   * _parseObject
   * 
   * @param {string} prop 
   * @param {object} result 
   * @param {*} query 
   * @param {*} routeQuery 
   * @param {*} queryOptions 
   */
  _parseObject (prop, result, query, routeQuery, queryOptions) {
    const { _type, _validate, _strict, _key, ...rest } = get(queryOptions, prop)

    const value = get(routeQuery, prop)

    const isValidType = this._validateType(_type, value, _key)
    if (!isValidType) return

    /**
     * Ensures all query strings from route query are valid for this current
     * query option item object.
     */
    const validProps = this._validateObjectProps(_validate, value, _key)

    // console.log('\n')
    // console.log( 
    //   'validProps', _key, validProps
    //  )
    // console.log('\n')

    /**
     * Recursively parse props in current route query object
     */
    const _result = this._recursivelyParse(validProps, queryOptions[prop], query, _key)

    /**
     * If current route query object end up being empty, don't 
     * return since it won't be part of the valid query strings
     */
    if (isEmpty(_result)) {
      this.errors.push({
        prop: _key,
        action: 'removed from query',
        method: '_parseObject',
        message: `"${_key}" is empty`
      })
      return
    }
    
    result[prop] = _result
  }

  /**
   * _parseArray
   * 
   * @param {*} prop 
   * @param {*} result 
   * @param {*} query 
   * @param {*} routeQuery 
   * @param {*} queryOptions 
   */
  _parseArray (prop, queryKey, result, query, routeQuery, queryOptions) {
    const { _type, _validate, _key,  ...rest } = queryOptions[prop]
        
    const value = get(routeQuery, prop)

    const isValidType = this._validateType(_type, value, _key)
    if (!isValidType) return

    if (!rest['*']) {
      this.errors.push({
        prop: _key,
        action: 'removed from query',
        method: '_parseArray',
        message: `query rule "${_key}.*" is missing`
      })
      return
    }

    /**
     * Ensure 
     */
    // if (!this._validateType(_type, value, rest['*']._key)) {
    //   this.errors.push({
    //     prop: rest['*']._key,
    //     action: 'removed from query',
    //     method: '_parseArray',
    //     message: `value type of items in query string "${_key}.*" should be array`
    //   })
    //   return
    // }
  




    let _result = []

    forEach(value, (o, i) => {
      if (isPlainObject(o)) {
        const obj = this._recursivelyParse(o, rest['*'], query, `${queryKey}.${prop}.${i}`)
        if (size(obj) > 0) {
          _result.push(obj)
        }
      }  
      else if (isArray(o)) {
        // this._parseArray(prop, parentKey, result, query, routeQuery, queryOptions)
      } 
      else {
        const { 
          _type: __type, 
          _validate: __validate, 
          _strict: __strict, 
          _key: __key, 
          ..._rest
        } = rest['*']

        let _value = get(routeQuery, prop + '.' + i)
    
        const isValidType = this._validateType(__type, _value, `${queryKey}.${prop}.${i}`)
        if (!isValidType) return
    
        if (typeof __type === 'function') {
          _value = __type(_value)
        }

        const isValid = this._validateCustom(__validate, _value, `${queryKey}.${prop}.${i}`)
        if (!isValid) return
                
        set(routeQuery, prop + '.' + i, _value)

        _result.push(_value)
      }
    })

    /**
     * If current route query object end up being empty, don't 
     * return since it won't be part of the valid query strings
     */
    if (isEmpty(_result)) {
      this.errors.push({
        prop: _key,
        action: 'removed from query',
        method: '_parseObject',
        message: `"${_key}" is empty`
      })
      return
    }
    
    /**
     * Trigger the custom validate function under query rule, if any,
     */
    const isValid = this._validateCustom(_validate, _result, _key)
    if (!isValid) return
    
    result[prop] = _result
  }

  /**
   * _parseLiteral
   * 
   * @param {string} prop 
   * @param {object} result 
   * @param {*} query 
   * @param {*} routeQuery 
   * @param {*} queryOptions 
   */
  _parseLiteral (prop, key, result, query, routeQuery, queryOptions) {
    const { _type, _validate, _strict, _key, ...rest } = get(queryOptions, prop)

    let value = get(routeQuery, prop)

    const isValidType = this._validateType(_type, value, _key)
    if (!isValidType) return

    if (typeof _type === 'function') {
      value = _type(value)
    }

    const isValid = this._validateCustom(_validate, value, _key)
    if (!isValid) return

    set(routeQuery, prop, value)

    result[prop] = value
  }

  /**
   * _validateProp
   * 
   * @param {*} routeQuery 
   * @param {*} queryOptions 
   * @param {*} prop 
   * @param {*} parentKey 
   */
  _validateProp (routeQuery, queryOptions, prop, parentKey) {

    let key = parentKey ? `${parentKey}.${prop}` : prop
    if (!has(queryOptions, prop)) {  
      this.errors.push({
        prop: key,
        action: 'removed from query',
        method: '_validateProp',
        message: `"${key}" query options does not exist`
      })
      return false
    } else if (!has(routeQuery, prop)) {
      this.errors.push({
        prop: key,
        action: 'removed from query',
        method: '_validateProp',
        message: `"${key}" does not exist on route query strings`
      })
      return false
    }
    return true
  }

  /**
   * _validateType
   * 
   * @param {*} typeFn 
   * @param {*} value 
   * @param {*} key 
   */
  _validateType (typeFn, value, key) {
    const correctTypeFn = isArray(typeFn)
    ? typeFn.every(t => typeof t === 'function' || (isNativeNumberFn(t) && isNumber(value)))
    : typeof typeFn === 'function' || (isNativeNumberFn(typeFn) && isNumber(value));
  

    if (!correctTypeFn) {
      this.errors.push({
        prop: key,
        action: 'removed from query',
        method: '_validateType',
        message: `type property of query option "${key}" should be either a native type function (ex.:  Number ) or an array of native type functions (ex.: [String, Number] )`
      })
    }

    // Update hasSameType to handle string numbers
    const hasSameType = isArray(typeFn)
      ? typeFn.some(type => (typeof type() === typeof value) || (isNativeNumberFn(type) && isNumber(value)))
      : (typeof typeFn() === typeof value) || (isNativeNumberFn(typeFn) && isNumber(value));

    if (hasSameType) return true;

    const ofType = isArray(typeFn) 
      ? `${typeFn.map(t => getType(t)).join(', ')}`
      : getType(typeFn)

    this.errors.push({
      prop: key,
      action: 'removed from query',
      method: '_validateType',
      message: `Type validation failed on "${key}". It's value should be "${ofType}", but received "${getType(value)}"`
    })
    return false
  }

  /**
   * _validateCustom
   * 
   * @param {*} validateFn 
   * @param {*} value 
   * @param {*} key 
   */
  _validateCustom (validateFn, value, key) {
    if (typeof validateFn !== 'function') {      
      return true
    }

    const isValid = validateFn(value, this.ctx)

    if (typeof isValid !== 'boolean') {
      this.errors.push({
        prop: key,
        action: 'removed from query',
        method: '_validateCustom',
        message: `Validate function under ${key} query rule should return a boolean`
      })
      return false
    }

    if (!isValid) {
      this.errors.push({
        prop: key,
        action: 'removed from query',
        method: '_validateCustom',
        message: `Validate function under ${key} query rule has failed`
      })
      return false
    }

    return true
  }


  /**
   * _validateObjectProps
   * 
   * @param {function} validateFn 
   * @param {object} value 
   * @param {strin} key 
   * @returns {object} - Returns only valid prop. Invalid ones has been removed.
   */
  _validateObjectProps (validateFn, value, key) {
    if (typeof validateFn !== 'function') {      
      return value
    }

    /**
     * Check if route query strings contains valid props
     * of current object and simply remove them if are invalid
     */
    let obj = reduce(value, (r, v, k) => {

      const isValid = validateFn(k, this.ctx)

      if (isValid) {
        r[k] = v
      } else {
        this.errors.push({
          prop: key,
          child: k,
          action: 'removed from query',
          method: '_validateObjectProps',
          message: `Validate function under ${key} query rule has failed. "${k}" property is not allowed within "${key}" object in the query string`
        })
      }
      return r
    }, {})

    return obj
  }
}

export default QueryStringParser