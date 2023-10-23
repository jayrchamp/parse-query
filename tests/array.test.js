const _ = require('lodash')

const parseQuery = require('../dist/parseQuery.umd.min.js')

describe('context passed to query option validators', () => {
  
  it(`should validate the a query rule array always has a start child "*" `, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [ 1 ]
      }
    }


    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and',
          action: 'removed from query',
          method: '_parseArray',
          message: 'query rule "filters.$and.*" is missing'
        },
        {
          prop: 'filters',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters" is empty'
        }
      ]
    );

  });

  it(`should ..`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array,
        validate: (value) => {
          return true
        }
      },
      'filters.$and.*': {
        type: Number
      }
    }

    const routeQuery = {
      filters: {
        $and: [1]
      }
    }


    const obj = parseQuery(routeQuery, queryRules)

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

  it(`should validate the type of the value passed`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: 1
      }
    }


    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and',
          action: 'removed from query',
          method: '_validateType',
          message: `Type validation failed on "filters.$and". It's value should be "array", but received "number"`
        },
        {
          prop: 'filters',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters" is empty'
        }
      ]
    );

  });

  it(`should passed validation when no validate function is provided`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Number
      }
    }

    const routeQuery = {
      filters: {
        $and: [ 1 ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual({ filters: { $and: [ 1 ] } });
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);

  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array,
        validate: (value) => {
          return true
        }
      },

      'filters.$and.*': {
        type: Object,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: 1
      }
    }


    const obj = parseQuery(routeQuery, queryRules)


    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and',
          action: 'removed from query',
          method: '_validateType',
          message: `Type validation failed on "filters.$and". It's value should be "array", but received "number"`
        },
        {
          prop: 'filters',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters" is empty'
        }
      ]
    );
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Object,
        validate: (value) => {
          return [
            'delayId'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId': {
        type: Number,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [
          { delayId: 1 },
          { delayId: 2 }
        ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual(routeQuery);
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Object,
        validate: (value) => {
          return [
            'delayId'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId': {
        type: Object,
        validate: (value) => {
          return [
            '$eq'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId.$eq': {
        type: Number,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [
          { delayId: { $eq: 1 } },
          { delayId: { $eq: 2 } }
        ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual(routeQuery);
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Number,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [ 1 ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual(routeQuery);
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Number,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [ '1' ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual({ filters: { $and: [ 1 ] } });
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Object,
        validate: (value) => {
          return [
            'delayId'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId': {
        type: Object,
        validate: (value) => {
          return [
            '$eq'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId.$eq': {
        type: Number,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [ 1 ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and.0',
          action: 'removed from query',
          method: '_validateType',
          message: `Type validation failed on "filters.$and.0". It's value should be "object", but received "number"`
        },
        {
          prop: 'filters.$and',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters.$and" is empty'
        },
        {
          prop: 'filters',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters" is empty'
        }
      ]
    );
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Object,
        validate: (value) => {
          return [
            'delayId'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId': {
        type: Object,
        validate: (value) => {
          return [
            '$eq'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayId.$eq': {
        type: Number,
        validate: (value) => {
          return true
        }
      }
    }

    const routeQuery = {
      filters: {
        $and: [ 
          1,
          {
            delayId: {
              $eq: 1
            }
          }
        ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual(    {
      filters: {
        $and: [ { delayId: { $eq: 1 } } ]
      }
    });
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and.0',
          action: 'removed from query',
          method: '_validateType',
          message: `Type validation failed on "filters.$and.0". It's value should be "object", but received "number"`
        }
      ]
    );
  });

  it(`should ...`, function() {

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array
      },

      'filters.$and.*': {
        type: Object,
        validate: (value) => {
          return [
            'delayId'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayIds': {
        type: Array
      },

      'filters.$and.*.delayIds.*': {
        type: Object,
        validate: (value) => {
          return [
            '$eq'
          ].indexOf(value) >= 0
        }
      },

      'filters.$and.*.delayIds.*.$eq': {
        type: Number
      }
    }

    const routeQuery = {
      filters: {
        $and: [ 
          {
            delayIds: [
              1,
              {
                $eq: 1
              }
            ]
          },
          {
            delayIds: ['2']
          }
        ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(obj.query).toEqual(    {
      filters: {
        $and: [
          { delayIds: [ { $eq: 1 } ] }
        ]
      }
    });
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and.0.delayIds.0',
          action: 'removed from query',
          method: '_validateType',
          message: `Type validation failed on "filters.$and.0.delayIds.0". It's value should be "object", but received "number"`
        },
        {
          prop: 'filters.$and.1.delayIds.0',
          action: 'removed from query',
          method: '_validateType',
          message: `Type validation failed on "filters.$and.1.delayIds.0". It's value should be "object", but received "string"`
        },
        {
          prop: 'filters.$and.*.delayIds',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters.$and.*.delayIds" is empty'
        }
      ]
    );
  });

  it(`should trigger custom validate function containing only the valid array items`, function() {

    let array = null

    const queryRules = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            '$and'
          ].indexOf(value) >= 0
        }
      },
      'filters.$and': {
        type: Array,
        validate: (value) => {
          array = value
          return true
        }
      },
      'filters.$and.*': {
        type: Number
      }
    }

    const routeQuery = {
      filters: {
        $and: [
          1,
          {
            delayIds: [
              1,
              {
                $eq: 1
              }
            ]
          },
          {
            delayIds: ['2']
          }
        ]
      }
    }

    const obj = parseQuery(routeQuery, queryRules)

    expect(array).toEqual( [ 1 ] )
    expect(obj.query).toEqual( { filters: { '$and': [ 1 ] } });

    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [
        {
          prop: 'filters.$and.1.delayIds',
          action: 'removed from query',
          method: '_validateProp',
          message: '"filters.$and.1.delayIds" query options does not exist'
        },
        {
          prop: 'filters.$and.2.delayIds',
          action: 'removed from query',
          method: '_validateProp',
          message: '"filters.$and.2.delayIds" query options does not exist'
        }
      ]
    );
  });

  // it(`should ..`, function() {

  //   const queryRules = {
  //     filters: {
  //       type: Object,
  //       validate: (value) => {
  //         return [
  //           '$and'
  //         ].indexOf(value) >= 0
  //       }
  //     },
  //     'filters.$and': {
  //       type: Array,
  //       validate: (value) => {
  //         return true
  //       }
  //     },
  //     'filters.$and.*': {
  //       type: Number
  //     }
  //   }

  //   const routeQuery = {
  //     filters: {
  //       $and: ['1']
  //     }
  //   }


  //   const obj = parseQuery(routeQuery, queryRules)

  //   // console.log('\n')
  //   // console.log( obj.errors )
  //   // console.log('\n')

  //   // expect(obj.query).toEqual({});
  //   // expect(obj.isValid).toBe(false);
  //   // expect(obj.errors).toEqual(
  //   //   [
  //   //     {
  //   //       prop: 'filters.$and',
  //   //       action: 'removed from query',
  //   //       method: '_validateType',
  //   //       message: `Type validation failed on query string "filters.$and". It's value should be "array", but received "number"`
  //   //     },
  //   //     {
  //   //       prop: 'filters',
  //   //       action: 'removed from query',
  //   //       method: '_parseObject',
  //   //       message: '"filters" is empty'
  //   //     }
  //   //   ]
  //   // );

  // });


  // it(`should ...`, function() {

  //   const queryRules = {
  //     filters: {
  //       type: Object,
  //       validate: (value) => {
  //         return [
  //           'pivot'
  //         ].indexOf(value) >= 0
  //       }
  //     },
  //     'filters.pivot': {
  //       type: Object,
  //       validate: (value) => {
  //         return [
  //           'healthTopic'
  //         ].indexOf(value) >= 0
  //       }
  //     },
  //     'filters.pivot.healthTopic': {
  //       type: Object,
  //       validate: (value) => {
  //         return [
  //           'ids'
  //         ].indexOf(value) >= 0
  //       }
  //     },
  //     'filters.pivot.healthTopic.ids': {
  //       type: Object,
  //       validate: (value) => {
  //         return [
  //           'and'
  //         ].indexOf(value) >= 0
  //       }
  //     },
  //     'filters.pivot.healthTopic.ids.and': {
  //       type: Array
  //     },
  //     'filters.pivot.healthTopic.ids.and.*': {
  //       type: Number
  //     }
  //   }

  //   const routeQuery = {
  //     filters: {
  //       pivot: {
  //         healthTopic: { ids: { and: [ '47' ] } }
  //       }
  //     }
  //   }

  //   const obj = parseQuery(routeQuery, queryRules)

  //   // console.log(obj.errors);

  //   // expect(obj.query).toEqual(    {
  //   //   filters: {
  //   //     $and: [
  //   //       { delayIds: [ { $eq: 1 } ] }
  //   //     ]
  //   //   }
  //   // });
  //   // expect(obj.isValid).toBe(false);
  //   // expect(obj.errors).toEqual(
  //   //   [
  //   //     {
  //   //       prop: 'filters.$and.0.delayIds.0',
  //   //       action: 'removed from query',
  //   //       method: '_validateType',
  //   //       message: `Type validation failed on query string "filters.$and.0.delayIds.0". It's value should be "object", but received "number"`
  //   //     },
  //   //     {
  //   //       prop: 'filters.$and.1.delayIds.0',
  //   //       action: 'removed from query',
  //   //       method: '_validateType',
  //   //       message: `Type validation failed on query string "filters.$and.1.delayIds.0". It's value should be "object", but received "string"`
  //   //     },
  //   //     {
  //   //       prop: 'filters.$and.*.delayIds',
  //   //       action: 'removed from query',
  //   //       method: '_parseObject',
  //   //       message: '"filters.$and.*.delayIds" is empty'
  //   //     }
  //   //   ]
  //   // );
  // });


  /**
   * Add support for two-dimensional array
   */
  // it(`should ...`, function() {

  //   const queryRules = {
  //     filters: {
  //       type: Object,
  //       validate: (value) => {
  //         return [
  //           '$and'
  //         ].indexOf(value) >= 0
  //       }
  //     },
  //     'filters.$and': {
  //       type: Array
  //     },

  //     'filters.$and.*': {
  //       type: Array
  //     },

  //     'filters.$and.*.*': {
  //       type: Number
  //     }
  //   }

  //   const routeQuery = {
  //     filters: {
  //       $and: [ 
  //        [1],
  //        [2],
  //       ]
  //     }
  //   }

  //   const obj = parseQuery(routeQuery, queryRules)


  //   // obj.query.filters.$and.forEach(o => {
  //   //   console.log(o);
  //   // })
  //   console.log('\n')
  //   console.log(require('util').inspect(
     
  //     obj.query
  //   , false, null, true))
  //   console.log('\n')


  //   console.log( 
  //     obj.errors
  //    )
  //   console.log('\n')

  //   // expect(obj.query).toEqual(    {
  //   //   filters: {
  //   //     $and: [
  //   //       { delayIds: [ { $eq: 1 } ] }
  //   //     ]
  //   //   }
  //   // });
  //   // expect(obj.isValid).toBe(false);
  //   // expect(obj.errors).toEqual(
  //   //   [
  //   //     {
  //   //       prop: 'filters.$and.0.delayIds.0',
  //   //       action: 'removed from query',
  //   //       method: '_validateType',
  //   //       message: `Type validation failed on query string "filters.$and.0.delayIds.0". It's value should be "object", but received "number"`
  //   //     },
  //   //     {
  //   //       prop: 'filters.$and.1.delayIds.0',
  //   //       action: 'removed from query',
  //   //       method: '_validateType',
  //   //       message: `Type validation failed on query string "filters.$and.1.delayIds.0". It's value should be "object", but received "string"`
  //   //     },
  //   //     {
  //   //       prop: 'filters.$and.*.delayIds',
  //   //       action: 'removed from query',
  //   //       method: '_parseObject',
  //   //       message: '"filters.$and.*.delayIds" is empty'
  //   //     }
  //   //   ]
  //   // );
  // });
 
});