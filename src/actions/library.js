import { stringify } from 'query-string'

import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

/**
 * Get a page of libraryEntries
 */

export const LIBRARY_REQUEST = 'LIBRARY_REQUEST'
export const LIBRARY_SUCCESS = 'LIBRARY_SUCCESS'
export const LIBRARY_FAILURE = 'LIBRARY_FAILURE'

const fetchLibraryEntries = (url, libraryType, workType) => ({
    [FETCH_API]: {
            endpoint: url,
            method: 'GET',
            types: [LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE]
        },
    libraryType,
    workType
})

/**
 * Load a page of library entries from server
 * @param libraryType precise type of library entries
 * @param params contains query and page number
 */
export const loadLibraryEntries = (
    library,
    { query, page = 1, type } = {}
) => {
    const queryString = stringify({
        ...(page) && {page},
        ...(query) && {query},
        ...(type) && {type},
    })

    const url = `${baseUrl}/library/${library}/?${queryString}`

    return fetchLibraryEntries(url, library, type)
}


/**
 * Get work types
 */

export const WORK_TYPES_REQUEST = 'WORK_TYPES_REQUEST'
export const WORK_TYPES_SUCCESS = 'WORK_TYPES_SUCCESS'
export const WORK_TYPES_FAILURE = 'WORK_TYPES_FAILURE'

/**
 * Load work types from the server 
 */
export const loadWorkTypes = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/library/work-types/`,
            method: 'GET',
            types: [WORK_TYPES_REQUEST, WORK_TYPES_SUCCESS, WORK_TYPES_FAILURE]
        }
})
