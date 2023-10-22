// const parseQueryStrings = require('/Users/xjr/Desktop/@jayrchamp/parse-query/dist/parseQuery.umd.js')
// const parseQueryStrings = require('@jayrchamp/parse-query')
const parseQueryStrings = require('../dist/parseQuery.umd.min.js')

describe('global', () => {
  it(`should set an error when a validate function isn't returning a boolean`, function() {
    const queryOptions = {
      filters: {
        type: Object,
        validate: (value) => {
          return ['type'].indexOf(value) >= 0
        }
      }
    }

    const routeQuery = {
      filters: {
        type: 'professional',
      }
    }

    const obj = parseQueryStrings(routeQuery, queryOptions)

    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual([
      { 
        prop: 'filters.type',
        action: 'removed from query',
        method: '_validateProp',
        message: '"filters.type" query options does not exist'
      },
      { 
        prop: 'filters',
        action: 'removed from query',
        method: '_parseObject',
        message: '"filters" is empty' 
      }
    ]);
  });

  it(`should set an error and not set prop on valid query strings when type is not valid`, function() {
    const queryOptions = {
      filters: {
        type: String,
        validate: (value) => {
          return ['type'].indexOf(value) >= 0
        }
      }
    }

    const routeQuery = {
      filters: {
        type: 'professional',
      }
    }

    const obj = parseQueryStrings(routeQuery, queryOptions)

    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual([
      { 
        prop: 'filters',
        action: 'removed from query',
        method: '_validateType',
        message: `value query string "filters" should be of type "string", received "object"`
      }
    ]);
  });

  it(`should set an error when a validate function isn't returning a boolean`, function() {
    const queryOptions = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            'type'
          ].indexOf(value) >= 0
        }
      },
      'filters.type': {
        type: String,
        validate: (value) => {
          return []
        }
      }
    }

    const routeQuery = {
      filters: {
        type: 'professional',
      }
    }

    const obj = parseQueryStrings(routeQuery, queryOptions)

    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual([
      { 
        prop: 'filters.type',
        action: 'removed from query',
        method: '_validateCustom',
        message: 'Validate function under filters.type query rule should return a boolean'
      },
      { 
        prop: 'filters',
        action: 'removed from query',
        method: '_parseObject',
        message: '"filters" is empty' 
      }
    ]);
  });

  it(`should work has expected when query options has an array of types`, function() {
    const queryOptions = {
      filters: {
        type: Object,
        validate: (value) => {
          return [
            'isSomeStringNumber'
          ].indexOf(value) >= 0
        }
      },
      'filters.isSomeStringNumber': {
        type: [String, Number],
        validate: (value) => 
          ['1'].indexOf(String(value)) >= 0
      }
    }

    const routeQuery = {
      filters: {
        isSomeStringNumber: '1',
      }
    }

    const obj = parseQueryStrings(routeQuery, queryOptions)
    
    expect(obj.query).toEqual(routeQuery);
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });

  describe('tests - type array', function () {
    it(`should work has expected when valid`, function() {
      const queryOptions = {
        filters: {
          type: Object,
          validate: (value) => {
            return [
              'professionalIds'
            ].indexOf(value) >= 0
          }
        },
        'filters.professionalIds': {
          type: Array,
          validate: (value, { store }) => 
          store.professionalIds.indexOf(Number(value)) >= 0
        }
      }
  
      const routeQuery = {
        filters: {
          professionalIds: [1,2,3,4,5]
        }
      }
  
      const context = {
        store: {
          professionalIds: [1,2,3,4,5]
        }
      }
  
      const obj = parseQueryStrings(routeQuery, queryOptions, context)

      expect(obj.query).toEqual(routeQuery);
      expect(obj.isValid).toBe(true);
      expect(obj.errors).toEqual([]);
    });
    it(`should work has expected even if items of array aren't exacte of the same type like numbers & string numbers as long as the developer handle the valdiate function correctly`, function() {
      const queryOptions = {
        filters: {
          type: Object,
          validate: (value) => {
            return [
              'professionalIds'
            ].indexOf(value) >= 0
          }
        },
        'filters.professionalIds': {
          type: Array,
          validate: (value, { store }) => 
          store.professionalIds.indexOf(String(value)) >= 0
        }
      }
  
      const routeQuery = {
        filters: {
          professionalIds: [1, 2, 3, 4, 5]
        }
      }
  
      const context = {
        store: {
          professionalIds: ['1', '2', '3', '4', '5']
        }
      }
  
      const obj = parseQueryStrings(routeQuery, queryOptions, context)

      expect(obj.query).toEqual(routeQuery);
      expect(obj.isValid).toBe(true);
      expect(obj.errors).toEqual([]);
    });
    it(`should only keep valid items of array if extra invalid items are present on route query`, function() {
      const queryOptions = {
        filters: {
          type: Object,
          validate: (value) => {
            return [
              'professionalIds'
            ].indexOf(value) >= 0
          }
        },
        'filters.professionalIds': {
          type: Array,
          validate: (value, { store }) => 
          store.professionalIds.indexOf(String(value)) >= 0
        }
      }
  
      const routeQuery = {
        filters: {
          professionalIds: [1, 2, 3, 4, 5, 6, 7, 8]
        }
      }
  
      const context = {
        store: {
          professionalIds: ['1', '2', '3', '4', '5']
        }
      }
  
      const obj = parseQueryStrings(routeQuery, queryOptions, context)

      expect(obj.query).toEqual({
        filters: {
          professionalIds: [1, 2, 3, 4, 5]
        }
      });
      expect(obj.isValid).toBe(false);
      expect(obj.errors).toEqual([
        { 
          prop: 'filters.professionalIds',
          action: 'removed from query',
          method: '_parseArray',
          message: 'value "6" of "filters.professionalIds" has failed validation from query option' 
        },
        { prop: 'filters.professionalIds',
          action: 'removed from query',
          method: '_parseArray',
          message: 'value "7" of "filters.professionalIds" has failed validation from query option' 
        },
        { 
          prop: 'filters.professionalIds',
          action: 'removed from query',
          method: '_parseArray',
          message: 'value "8" of "filters.professionalIds" has failed validation from query option' 
        } 
      ]);
    });
  })
});