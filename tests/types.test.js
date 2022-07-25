const _ = require('lodash')

// const parseQueryStrings = require('/Users/xjr/Desktop/@jayrchamp/parse-query/dist/parseQuery.umd.js')
// const parseQueryStrings = require('@jayrchamp/parse-query')
const parseQueryStrings = require('../dist/parseQuery.umd.min.js')

describe('', () => {
  it(`query option type property should accept a native function type or an array of native function types`, function() {
    const queryOptions = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            'age'
          ].indexOf(value) >= 0
        }
      },
      'filters.age': {
        type: Object,
        validate: (value) => {
          return [
            'min',
            'max'
          ].indexOf(value) >= 0
        }
      },
      'filters.age.min': {
        type: [String, Number],
        validate: (value, { app, route }) => {
          let max = app.$_.get(route, 'query.filters.age.max')
          max = Number(max)
          let min = Number(value)
          return !!(
            min >= 0 && 
            min <= 120 && 
            max >= 0 && 
            max <= 120 && 
            min <= max
          )
        }
      },
      'filters.age.max': {
        type: [String, Number],
        validate: (value, { app, route}) => {
          let min = app.$_.get(route, 'query.filters.age.min')
          min = Number(min)
          let max = Number(value)
          return !!(
            min >= 0 && 
            min <= 120 && 
            max >= 0 && 
            max <= 120 && 
            max >= min
          )
        }
      }
    }

    const routeQuery = {
      filters: {
        age: {
          min: 0,
          max: 120
        }
      }
    }

    const context = {
      store: {},
      app: {
        $_: _
      },
      route: {
        query: routeQuery
      }
    }

    const obj = parseQueryStrings(routeQuery, queryOptions, context)

    expect(obj.query).toEqual({
      filters: { 
        age: { 
          min: 0, max: 120 
        } 
      }
    });
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });


});