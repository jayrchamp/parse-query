const _ = require('lodash')

// const parseQueryStrings = require('/Users/xjr/Desktop/@jayrchamp/parse-query/dist/parseQuery.umd.js')
// const parseQuery = require('@jayrchamp/parse-query')
const parseQuery = require('../dist/parseQuery.umd.min.js')

describe('context passed to query option validators', () => {
  it(`should contain the same object than the context pass as a third argument to parseQuery`, function() {

    let external = {
      context: null
    }

    const queryOptions = {
      type: {
        type: String,
        validate: (value, ctx) => {
          external.context = ctx
          return true
        }
      }
    }

    const routeQuery = {
      type: 'a type'
    }

    const context = {
      prop1: 'some value'
    }

    parseQuery(routeQuery, queryOptions, context)
    expect(context).toEqual(external.context);
  });
});