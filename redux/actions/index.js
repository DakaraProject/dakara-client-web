import { FETCH_API } from '../middleware/fetchApi'
import utils from '../utils'

const { baseUrl } = utils.params


const delay = (action, delay) => ({
    ...action,
    delay
})

/**
 * Get a page of libraryEntries
 */

export const LIBRARY_REQUEST = 'LIBRARY_REQUEST'
export const LIBRARY_SUCCESS = 'LIBRARY_SUCCESS'
export const LIBRARY_FAILURE = 'LIBRARY_FAILURE'

const fetchLibraryEntries = (url, libraryType) => ({
    [FETCH_API]: {
            endpoint: url,
            method: 'GET',
            types: [LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE]
        },
    libraryType
})

/**
 * Load a page of library entries from server
 * @param libraryType type of library entries
 * @param workType precise type of library entries when it is a work
 * @param pageNumber page to load
 */
export const loadLibraryEntries = (libraryType = "songs", { workType, query, pageNumber = 1 } = {}) => {
    let url = `${baseUrl}library/${libraryType}/?page=${pageNumber}`

    // if `libraryType` is 'work', a `workType` has to be passed
    if (workType) {
        url += `&type=${workType}`
    }

    // query
    if (query) {
        url += `&query=${encodeURIComponent(query)}`
    }

    return fetchLibraryEntries(url, libraryType)
}


/**
 * Login
 */

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

/**
 * Login user to the server
 * @param username username
 * @param password password
 */
export const login  = (username, password) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}token-auth/`,
            method: 'POST',
            json: {username, password},
            types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE]
        }
})

/**
 * Get work types
 */

export const WORKTYPES_REQUEST = 'WORKTYPES_REQUEST'
export const WORKTYPES_SUCCESS = 'WORKTYPES_SUCCESS'
export const WORKTYPES_FAILURE = 'WORKTYPES_FAILURE'

/**
 * Load work types from the server 
 */
export const loadWorkTypes = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}library/work-types/`,
            method: 'GET',
            types: [WORKTYPES_REQUEST, WORKTYPES_SUCCESS, WORKTYPES_FAILURE]
        }
})

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

/**
 * Request to add a song to the playlist
 * @param songId ID of the song to add
 */
export const addSongToPlaylist = (songId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/`,
            method: 'POST',
            json: {song: songId},
            types: [
                ADDPLAYLIST_REQUEST,
                ADDPLAYLIST_SUCCESS,
                ADDPLAYLIST_FAILURE,
            ],
            onSuccess: [
                delay(clearSongListNotification(songId), 2000),
                loadPlaylist()
            ],
            onFailure: delay(clearSongListNotification(songId), 5000)
        },
    songId
})

/**
 * Clear playlist entry notification
 */

export const CLEAR_PLAYLIST_ENTRY_NOTIFICATION = 'CLEAR_PLAYLIST_ENTRY_NOTIFICATION'

/**
 * Clear the notification for the given playlist entry 
 * @param entryId the ID of the entry to clear the notification from
 */
export const clearPlaylistEntryNotification = (entryId) => ({
    type: CLEAR_PLAYLIST_ENTRY_NOTIFICATION,
    entryId
})

/**
 * Remove song from playlist
 */

export const REMOVEPLAYLISTENTRY_REQUEST = 'REMOVEPLAYLISTENTRY_REQUEST'
export const REMOVEPLAYLISTENTRY_SUCCESS = 'REMOVEPLAYLISTENTRY_SUCCESS'
export const REMOVEPLAYLISTENTRY_FAILURE = 'REMOVEPLAYLISTENTRY_FAILURE'

/**
 * Request to remove an entry from the playlist
 * @param entryId Id of the entry to remove
 */
export const removeEntryFromPlaylist = (entryId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/${entryId}/`,
            method: 'DELETE',
            types: [
                REMOVEPLAYLISTENTRY_REQUEST,
                REMOVEPLAYLISTENTRY_SUCCESS,
                REMOVEPLAYLISTENTRY_FAILURE,
            ],
            onSuccess: loadPlaylist(),
            onFailure: delay(clearPlaylistEntryNotification(entryId), 5000)
        },
    entryId
})

/**
 * Player notifications
 */

export const CREATE_PLAYER_NOTIFICATION = "CREATE_PLAYER_NOTIFICATION"
export const CLEAR_PLAYER_NOTIFICATION = "CLEAR_PLAYER_NOTIFICATION"

export const clearPlayerNotification = (errorId) => ({
    type: CLEAR_PLAYER_NOTIFICATION,
    errorId
})

const createPlayerNotification = (id, message) => (dispatch, getState) => {
    dispatch(delay(clearPlayerNotification(id), 5000))
    return dispatch(
        {
            type: CREATE_PLAYER_NOTIFICATION,
            error: {
                id,
                message
            }
        }
    )
}


/**
 * Get player status 
 */

export const PLAYERSTATUS_REQUEST = 'PLAYERSTATUS_REQUEST'
export const PLAYERSTATUS_SUCCESS = 'PLAYERSTATUS_SUCCESS'
export const PLAYERSTATUS_FAILURE = 'PLAYERSTATUS_FAILURE'

/**
 * Action creator for player error notification
 */
const notifyOnError = (dispatch, getState, action) => {
    // get the id of the latest new errors
    const errorsNew = action.response.errors

    if (!errorsNew.length) {
        return null
    }

    const latestErrorNew = errorsNew[errorsNew.length - 1]
    const latestErrorNewId = latestErrorNew.id
    const latestErrorNewMessage = latestErrorNew.error_message

    // get the id of the latest current errors
    const errors = getState().player.status.data.errors

    let latestErrorId
    if (errors.length) {
        latestErrorId = errors[errors.length - 1].id
    } else {
        latestErrorId = -1
    }

    if (latestErrorNewId != latestErrorId) {
        return dispatch(createPlayerNotification(
            latestErrorNewId,
            latestErrorNewMessage
        ))

    } else {
        return null
    }
}

/**
 * Request player status 
 */
export const loadPlayerStatus = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/player/`,
            method: 'GET',
            types: [
                PLAYERSTATUS_REQUEST,
                PLAYERSTATUS_SUCCESS,
                PLAYERSTATUS_FAILURE
            ],
            onSuccess: notifyOnError
        }
})

/**
 * Send player commands
 */

export const PLAYERCOMMANDS_REQUEST = 'PLAYERCOMMANDS_REQUEST'
export const PLAYERCOMMANDS_SUCCESS = 'PLAYERCOMMANDS_SUCCESS'
export const PLAYERCOMMANDS_FAILURE = 'PLAYERCOMMANDS_FAILURE'

/**
 * Send commands to the player
 * @param commands : object containing pause and skip commands booleans
 */
export const sendPlayerCommands = (commands) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/player/manage/`,
            method: 'PUT',
            json: commands,
            types: [
                PLAYERCOMMANDS_REQUEST,
                PLAYERCOMMANDS_SUCCESS,
                PLAYERCOMMANDS_FAILURE
            ],
            onSuccess: loadPlayerStatus()
        },
    commands
})

/**
 * Get playlist entries 
 */

export const PLAYLIST_REQUEST = 'PLAYLIST_REQUEST'
export const PLAYLIST_SUCCESS = 'PLAYLIST_SUCCESS'
export const PLAYLIST_FAILURE = 'PLAYLIST_FAILURE'

/**
 * Request playlist 
 */
export const loadPlaylist = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/`,
            method: 'GET',
            types: [PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE],
        }
})

/**
 * Toogle playlist collasped state
 */

export const PLAYLIST_TOOGLE_COLLAPSED = 'PLAYLIST_TOOGLE_COLLAPSED'

/**
 * Toogle the collapsed state of the playlist
 */
export const toogleCollapsedPlaylist = () => ({
    type: PLAYLIST_TOOGLE_COLLAPSED
})
