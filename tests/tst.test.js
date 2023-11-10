const _ = require('lodash')

const parseQuery = require('../dist/parseQuery.umd.min.js')

describe('context passed to query option validators', () => {
  
  it(`should ..`, function() {

    const queryRules = {
      filter: {
        type: Object,
        validate: (value) => {
          return [
            'id'
          ].indexOf(value) >= 0
        }
      },
      'filter.id': {
        type: Object,
        validate: (value) => {
          return [
            '$in'
          ].indexOf(value) >= 0
        }
      },
      'filter.id.$in': {
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


    const obj = parseQuery(routeQuery, queryRules)

    console.log('\n')
    console.log(require('util').inspect(
     
      obj
    , false, null, true))
    console.log('\n')

    // expect(obj.query).toEqual({});
    // expect(obj.isValid).toBe(false);
    // expect(obj.errors).toEqual(
    //   [
    //     {
    //       prop: 'filters.$and',
    //       action: 'removed from query',
    //       method: '_validateType',
    //       message: `Type validation failed on query string "filters.$and". It's value should be "array", but received "number"`
    //     },
    //     {
    //       prop: 'filters',
    //       action: 'removed from query',
    //       method: '_parseObject',
    //       message: '"filters" is empty'
    //     }
    //   ]
    // );

  });

});