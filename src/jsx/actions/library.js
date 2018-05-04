import { stringify } from 'query-string'
import { FETCH_API } from 'middleware/fetchApi'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE, ALTERATION_CLEAR } from './alterations'
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
export const loadLibraryEntries = (libraryType = "song", { query, pageNumber = 1 } = {}) => {
    let serverLibraryName
    let workType
    switch (libraryType) {
        case 'song':
            serverLibraryName = 'songs'
            break

        case 'artist':
            serverLibraryName = 'artists'
            break

        default:
            serverLibraryName = 'works'
            workType = libraryType
    }

    const queryString = stringify({
        page: pageNumber,
        type: workType,
        query
    })

    const url = `${baseUrl}library/${serverLibraryName}/?${queryString}`

    return fetchLibraryEntries(url, serverLibraryName, workType)
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
            endpoint: `${baseUrl}library/work-types/`,
            method: 'GET',
            types: [WORK_TYPES_REQUEST, WORK_TYPES_SUCCESS, WORK_TYPES_FAILURE]
        }
})

/**
 * Clear library song list notification
 */

/**
 * Clear the notification for the given song
 * @param songId the ID of the song to clear the notification
 */
export const clearSongListNotification = (songId) => ({
    type: ALTERATION_CLEAR,
    alterationName: "addSongToPlaylist",
    elementId: songId,
})
