const _ = require('lodash')

const parseQuery = require('../dist/parseQuery.umd.min.js')

describe('', () => {

  it(`should throw an error if some keys of query option aren't valid`, function() {

    const queryRules = {
      filter: {
        type: Object,
        validate: (value) => {
          return [
            'id'
          ].indexOf(value) >= 0
        }
      },
      'filter.id.': {
        type: Object,
        validate: (value) => {
          return [
            '$in'
          ].indexOf(value) >= 0
        }
      },
      'filter.id.$in.': {
        type: Array
      },
      'filter.id.$in.*': {
        type: String
      }
    }

    const routeQuery = {
      filter: {
        id: {
          $in: [
            '1'
          ]
        }
      }
    }

    expect(() => parseQuery(routeQuery, queryRules)).toThrow("[@jayrchamp/parse-query] Invalid query option keys: ->  filter.id. | filter.id.$in.  <-");
  });
  
});