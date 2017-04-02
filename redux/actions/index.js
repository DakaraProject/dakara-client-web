import { CALL_API } from 'redux-api-middleware'

/**
 * Get a page of libraryEntries
 */

export const LIBRARY_REQUEST = 'LIBRARY_REQUEST'
export const LIBRARY_SUCCESS = 'LIBRARY_SUCCESS'
export const LIBRARY_FAILURE = 'LIBRARY_FAILURE'

const fetchLibraryEntries = (url, libraryType) => ({
    [CALL_API]: {
            endpoint: url,
            method: 'GET',
            types: [LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE],
            meta: { libraryType }
        }
})

/**
 * Load a page of library entries from server
 * @param libraryType type of library entries
 * @param workType precise type of library entries when it is a work
 * @param pageNumber page to load
 */
export const loadLibraryEntries = (libraryType = "songs", { workType, query, pageNumber = 1 } = {}) => (dispatch, getState) => {
    let url = `/api/library/${libraryType}/?page=${pageNumber}`

    // if `libraryType` is 'work', a `workType` has to be passed
    if (workType) {
        url += `&type=${workType}`
    }

    // query
    if (query) {
        url += `&query=${query}`
    }

    return dispatch(fetchLibraryEntries(url, libraryType))
}


/**
 * Login
 */

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

const sendLoginRequest = (username, password) => ({
    [CALL_API]: {
            endpoint: '/api/token-auth/',
            method: 'POST',
            json: {username, password},
            types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE]
        }
})

/**
 * Login user to the server
 * @param username username
 * @param password password
 */
export const login = (username, password) => (dispatch) => {
    return dispatch(sendLoginRequest(username, password))
}

/**
 * Get work types
 */

export const WORKTYPES_REQUEST = 'WORKTYPES_REQUEST'
export const WORKTYPES_SUCCESS = 'WORKTYPES_SUCCESS'
export const WORKTYPES_FAILURE = 'WORKTYPES_FAILURE'

const sendWorkTypesRequest = () => ({
    [CALL_API]: {
            endpoint: '/api/library/work-types/',
            method: 'GET',
            types: [WORKTYPES_REQUEST, WORKTYPES_SUCCESS, WORKTYPES_FAILURE]
        }
})

/**
 * Load work types from the server 
 */
export const loadWorkTypes = () => (dispatch) => {
    return dispatch(sendWorkTypesRequest())
}

/**
 * Logout
 */

export const LOGOUT = 'LOGOUT'

/**
 * Logout user by deleting the token
 */
export const logout = () => ({
    type: LOGOUT
})

/**
 * Clear library song list notification
 */

export const CLEAR_SONG_LIST_NOTIFICATION = 'CLEAR_SONG_LIST_NOTIFICATION'

/**
 * Clear the notification for the given song
 * @param songId the ID of the song to clear the notification
 */
export const clearSongListNotification = (songId) => ({
    type: CLEAR_SONG_LIST_NOTIFICATION,
    songId
})

/**
 * Add song to playlist
 */

export const ADDPLAYLIST_REQUEST = 'ADDPLAYLIST_REQUEST'
export const ADDPLAYLIST_SUCCESS = 'ADDPLAYLIST_SUCCESS'
export const ADDPLAYLIST_FAILURE = 'ADDPLAYLIST_FAILURE'

const sendAddPlaylistRequest = (songId) => ({
    [CALL_API]: {
            endpoint: '/api/playlist/',
            method: 'POST',
            json: {song: songId},
            types: [
                ADDPLAYLIST_REQUEST,
                {
                    type: ADDPLAYLIST_SUCCESS,
                    meta: {delayedAction: {
                        action: clearSongListNotification(songId),
                        delay: 2000
                    }}
                },
                {
                    type: ADDPLAYLIST_FAILURE,
                    meta: {delayedAction: {
                        action: clearSongListNotification(songId),
                        delay: 5000
                    }}
                },
            ],
            meta: { songId }
        }
})

/**
 * Request to add a song to the playlist
 * @param songId ID of the song to add
 */
export const addSongToPlaylist = (songId) => (dispatch) => {
    return dispatch(sendAddPlaylistRequest(songId))
}
