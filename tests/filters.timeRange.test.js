const _ = require('lodash')
const moment = require('moment-timezone')
// const parseQueryStrings = require('/Users/xjr/Desktop/@jayrchamp/parse-query/dist/parseQuery.umd.js')
// const parseQueryStrings = require('@jayrchamp/parse-query')
const parseQueryStrings = require('../dist/parseQuery.umd.min.js')

describe("filters.timeRange w/ correctly set queryOptions ", function() {
  const queryOptions = {
    filters: {
      type: Object,
      validate: (value) => {
        return [
          'timeRange'
        ].indexOf(value) >= 0
      }
    },
    'filters.timeRange': {
      type: Object,
      validate: (value) => {
        return [
          'startedAt',
          'endedAt'
        ].indexOf(value) >= 0
      }
    },
    'filters.timeRange.startedAt': {
      type: String,
      validate: (value, { app, route }) => {
        let endedAt = app.$_.get(route, 'query.filters.timeRange.endedAt')
        endedAt = app.$moment(endedAt, 'YYYY-MM-DD', true)
        const startedAt = app.$moment(value, 'YYYY-MM-DD', true)
        return startedAt.isValid() && endedAt.isValid() && endedAt.isSameOrAfter(startedAt)
      }
    },
    'filters.timeRange.endedAt': {
      type: String,
      validate: (value, { app, route}) => {
        let startedAt = app.$_.get(route, 'query.filters.timeRange.startedAt')
        startedAt = app.$moment(startedAt, 'YYYY-MM-DD', true)      
        const endedAt = app.$moment(value, 'YYYY-MM-DD', true)
        return endedAt.isValid() && startedAt.isValid() && endedAt.isSameOrAfter(startedAt)
      }
    }
  }

  it(`should passed when all requirement are met`, function() {
    const routeQuery = {
      filters: {
        timeRange: {
          startedAt: '2020-12-09',
          endedAt: '2020-12-09'
        }
      }
    }
  
    const context = {
      store: {},
      app: {
        $moment: moment,
        $_: _
      },
      route: {
        query: routeQuery
      }
    }
  
    const obj = parseQueryStrings(routeQuery, queryOptions, context)
  
    expect(obj.query).toEqual({
      filters: { 
        timeRange: { 
          startedAt: '2020-12-09', 
          endedAt: '2020-12-09' 
        } 
      } 
    });
    expect(obj.isValid).toBe(true);
    expect(obj.errors).toEqual([]);
  });

  it(`validate function from query option should fail if filters.timeRange.endedAt is before filters.timeRange.startedAt`, function() {  
    const routeQuery = {
      filters: {
        timeRange: {
          startedAt: '2020-12-09',
          endedAt: '2020-12-08'
        }
      }
    }
  
    const context = {
      store: {},
      app: {
        $moment: moment,
        $_: _
      },
      route: {
        query: routeQuery
      }
    }
  
    const obj = parseQueryStrings(routeQuery, queryOptions, context)
  
    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [ { prop: 'filters.timeRange.startedAt',
          action: 'removed from query',
          method: '_validateCustom',
          message: 'Validate function from query option has failed' },
        { prop: 'filters.timeRange.endedAt',
          action: 'removed from query',
          method: '_validateCustom',
          message: 'Validate function from query option has failed' },
        { prop: 'filters.timeRange',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters.timeRange" is empty' },
        { prop: 'filters',
          method: '_parseObject',
          action: 'removed from query',
          message: '"filters" is empty' } ]
    );
  });

  it(`validate function from query option should fail if filters.timeRange.endedAt is an invalid date`, function() {  
    const routeQuery = {
      filters: {
        timeRange: {
          startedAt: '2020-12-09',
          endedAt: 'asdsadasd'
        }
      }
    }
  
    const context = {
      store: {},
      app: {
        $moment: moment,
        $_: _
      },
      route: {
        query: routeQuery
      }
    }
  
    const obj = parseQueryStrings(routeQuery, queryOptions, context)
  
    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [ { prop: 'filters.timeRange.startedAt',
          action: 'removed from query',
          method: '_validateCustom',
          message: 'Validate function from query option has failed' },
        { prop: 'filters.timeRange.endedAt',
          action: 'removed from query',
          method: '_validateCustom',
          message: 'Validate function from query option has failed' },
        { prop: 'filters.timeRange',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters.timeRange" is empty' },
        { prop: 'filters',
          method: '_parseObject',
          action: 'removed from query',
          message: '"filters" is empty' } ]
    );
  });

  it(`validate function from query option should fail if filters.timeRange.startedAt is an invalid date`, function() {  
    const routeQuery = {
      filters: {
        timeRange: {
          startedAt: 'adasd',
          endedAt: '2020-12-08'
        }
      }
    }
  
    const context = {
      store: {},
      app: {
        $moment: moment,
        $_: _
      },
      route: {
        query: routeQuery
      }
    }
  
    const obj = parseQueryStrings(routeQuery, queryOptions, context)
  
    expect(obj.query).toEqual({});
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual(
      [ { prop: 'filters.timeRange.startedAt',
          action: 'removed from query',
          method: '_validateCustom',
          message: 'Validate function from query option has failed' },
        { prop: 'filters.timeRange.endedAt',
          action: 'removed from query',
          method: '_validateCustom',
          message: 'Validate function from query option has failed' },
        { prop: 'filters.timeRange',
          action: 'removed from query',
          method: '_parseObject',
          message: '"filters.timeRange" is empty' },
        { prop: 'filters',
          method: '_parseObject',
          action: 'removed from query',
          message: '"filters" is empty' } ]
    );
  });

  it(`should remove invalid props from query if any are present in route query`, function() {  
    const routeQuery = {
      filters: {
        pogo: 'an invalid prop',
        timeRange: {
          startedAt: '2020-12-09',
          endedAt: '2020-12-09'
        }
      }
    }
  
    const context = {
      store: {},
      app: {
        $moment: moment,
        $_: _
      },
      route: {
        query: routeQuery
      }
    }
  
    const obj = parseQueryStrings(routeQuery, queryOptions, context)
  
    expect(obj.query).toEqual({
      filters: {
        timeRange: {
          startedAt: '2020-12-09',
          endedAt: '2020-12-09'
        }
      }
    });
    /** isValid return false to indicate that the route query wasn't pure */
    expect(obj.isValid).toBe(false);
    expect(obj.errors).toEqual([ 
      { 
        child: 'pogo',
        prop: 'filters',
        action: 'removed from query',
        method: '_validateObjectProps',
        message: 'Validate function from query option failed for prop "pogo" in filters' 
      } 
    ]);
  });
})


