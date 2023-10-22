const _ = require('lodash')
const moment = require('moment-timezone')
// const parseQueryStrings = require('/Users/xjr/Desktop/@jayrchamp/parse-query/dist/parseQuery.umd.js')
// const parseQueryStrings = require('@jayrchamp/parse-query')
const parseQueryStrings = require('../dist/parseQuery.umd.min.js')

describe("filters.questionsCount w/ correctly set queryOptions ", function() {
  const queryOptions = {
    filters: {
      type: Object,
      validate: (value) => {
        return [
          'questionsCount'
        ].indexOf(value) >= 0
      }
    },
    'filters.questionsCount': {
      type: Object,
      validate: (value) => {
        // console.log('\n')
        // console.log('questionsCount', value )
        // console.log('\n')
        return [
          'min',
          'max'
        ].indexOf(value) >= 0
      }
    },
    'filters.questionsCount.min': {
      type: [String, Number],
      validate: (value, { app, route }) => {
        // console.log('\n')
        // console.log('min', value )
        // console.log('\n')
        let max = app.$_.get(route, 'query.filters.questionsCount.max')
        max = Number(max)
        let min = Number(value)
        return !!(
          min >= 0 && 
          max >= 0 && 
          min <= max
        )
      }
    },
    'filters.questionsCount.max': {
      type: [String, Number],
      validate: (value, { app, route}) => {
        // console.log('\n')
        // console.log('max', value )
        // console.log('\n')
        let min = app.$_.get(route, 'query.filters.questionsCount.min')
        min = Number(min)
        let max = Number(value)
        return !!(
          min >= 0 && 
          max >= 0 &&
          max >= min
        )
      }
    }
  }

  it(`should passed when all requirement are met`, function() {
    const routeQuery = {
      filters: {
        questionsCount: {
          // min: 0,
          // max: 100
          min: '0',
          max: '100'
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
    // console.log(obj);
  
    expect(obj.query).toEqual(routeQuery);
    // expect(obj.isValid).toBe(true);
    // expect(obj.errors).toEqual([]);
  });


})


