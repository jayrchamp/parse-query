import has from 'lodash/has'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import isEmpty from 'lodash/isEmpty'
import { isPlainObject, isArray, isFilledObject, getType } from '../utils'

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
      query = Object.keys(routeQuery).reduce((result, prop, i) => {

        const isValidProp = this._validateProp(routeQuery, queryOptions, prop, parentKey)
        if (!isValidProp) return result

        if (isPlainObject(routeQuery[prop])) {
          this._parseObject(prop, result, query, routeQuery, queryOptions)
        } else if (isArray(routeQuery[prop])) {
          this._parseArray(prop, result, query, routeQuery, queryOptions)
        } else {
          this._parseLiteral(prop, result, query, routeQuery, queryOptions)
        } 

        return result
      }, {})
    }

    return query
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
  _parseArray (prop, result, query, routeQuery, queryOptions) {
    const { _type, _validate, _key,  ...rest } = queryOptions[prop]
    const value = get(routeQuery, prop)
    value.forEach((v, i) => {
      if (_validate(v, this.ctx)) {
        result[prop] = (result[prop] || [])
        result[prop].push(v)
      } else {
        this.errors.push({
          prop: _key,
          action: 'removed from query',
          method: '_parseArray',
          message: `value "${v}" of "${_key}" has failed validation from query option`
        })
      }
    })
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
  _parseLiteral (prop, result, query, routeQuery, queryOptions) {
    const { _type, _validate, _strict, _key, ...rest } = get(queryOptions, prop)

    const value = get(routeQuery, prop)
    
    const isValidType = this._validateType(_type, value, _key)
    if (!isValidType) return

    const isValid = this._validateCustom(_validate, value, _key)
    if (!isValid) return

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
      ? typeFn.every(t => typeof t === 'function') 
      : typeof typeFn === 'function'

    if (!correctTypeFn) {
      this.errors.push({
        prop: key,
        action: 'removed from query',
        method: '_validateType',
        message: `type property of query option "${key}" should be either a native type function (ex.:  Number ) or an array of native type functions (ex.: [String, Number] )`
      })
    }

    const hasSameType = isArray(typeFn)
      ? typeFn.some(type => typeof type() === typeof value)
      : typeof typeFn() === typeof value 

    if (hasSameType) return true

    const ofType = isArray(typeFn) 
      ? `${typeFn.map(t => getType(t)).join(', ')}`
      : getType(typeFn)
      
    this.errors.push({
      prop: key,
      action: 'removed from query',
      method: '_validateType',
      message: `query string "${key}" should be of type "${ofType}", received "${typeof value}"`
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