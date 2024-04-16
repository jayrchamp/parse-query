import { size } from './utils'
import deepDiff from './utils/deepDiff'
import parseQueryOptions from './helpers/parseQueryOptions'
import QueryStringParser from './classes/QueryStringParser'

export default (routeQuery, queryOptions, ctx = {}, options = {}) => {
  const parsedQueryOptions = parseQueryOptions(queryOptions)
  const queryStringParser = new QueryStringParser(routeQuery, parsedQueryOptions, ctx, options)
  queryStringParser.parse()
  const query = queryStringParser.getResult()
  const errors = queryStringParser.getErrors()
  return {
    query,
    isValid: errors.length <= 0,
    errors
  }
}