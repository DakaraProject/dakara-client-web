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

    return fetchLibraryEntries(url, libraryType, workType)
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
 * Token
 */

export const SET_TOKEN = 'SET_TOKEN'

export const setToken = (token) => ({
    type: SET_TOKEN,
    token
})

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

export const ADD_PLAYLIST_REQUEST = 'ADD_PLAYLIST_REQUEST'
export const ADD_PLAYLIST_SUCCESS = 'ADD_PLAYLIST_SUCCESS'
export const ADD_PLAYLIST_FAILURE = 'ADD_PLAYLIST_FAILURE'

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
                ADD_PLAYLIST_REQUEST,
                ADD_PLAYLIST_SUCCESS,
                ADD_PLAYLIST_FAILURE,
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

export const REMOVE_PLAYLIST_ENTRY_REQUEST = 'REMOVE_PLAYLIST_ENTRY_REQUEST'
export const REMOVE_PLAYLIST_ENTRY_SUCCESS = 'REMOVE_PLAYLIST_ENTRY_SUCCESS'
export const REMOVE_PLAYLIST_ENTRY_FAILURE = 'REMOVE_PLAYLIST_ENTRY_FAILURE'

/**
 * Request to remove an entry from the playlist
 * @param entryId Id of the entry to remove
 */
export const removeEntryFromPlaylist = (entryId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/${entryId}/`,
            method: 'DELETE',
            types: [
                REMOVE_PLAYLIST_ENTRY_REQUEST,
                REMOVE_PLAYLIST_ENTRY_SUCCESS,
                REMOVE_PLAYLIST_ENTRY_FAILURE,
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

export const PLAYER_STATUS_REQUEST = 'PLAYER_STATUS_REQUEST'
export const PLAYER_STATUS_SUCCESS = 'PLAYER_STATUS_SUCCESS'
export const PLAYER_STATUS_FAILURE = 'PLAYER_STATUS_FAILURE'

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
                PLAYER_STATUS_REQUEST,
                PLAYER_STATUS_SUCCESS,
                PLAYER_STATUS_FAILURE
            ],
            onSuccess: notifyOnError
        }
})

/**
 * Send player commands
 */

export const PLAYER_COMMANDS_REQUEST = 'PLAYER_COMMANDS_REQUEST'
export const PLAYER_COMMANDS_SUCCESS = 'PLAYER_COMMANDS_SUCCESS'
export const PLAYER_COMMANDS_FAILURE = 'PLAYER_COMMANDS_FAILURE'

/**
 * Send commands to the player
 * @param commands : object containing pause and skip commands booleans
 */
export const sendPlayerCommands = (commands) => {
    let message
    if (typeof commands.pause !== 'undefined') {
        message = "Unable to set pause"
    } else if (typeof commands.skip !== 'undefined') {
        message = "Unable to skip"
    } else {
        throw Error("Commands have neither `pause` nor `skip`")
    }

    const onFailureAction = createPlayerNotification(
        Date.now(), // id
        message
    )

    return {
        [FETCH_API]: {
                endpoint: `${baseUrl}playlist/player/manage/`,
                method: 'PUT',
                json: commands,
                types: [
                    PLAYER_COMMANDS_REQUEST,
                    PLAYER_COMMANDS_SUCCESS,
                    PLAYER_COMMANDS_FAILURE
                ],
                onSuccess: loadPlayerStatus(),
                onFailure: onFailureAction
        },
        commands
    }
}

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

/**
 * Get logged in user info 
 */

export const CURRENT_USER_REQUEST = 'CURRENT_USER_REQUEST'
export const CURRENT_USER_SUCCESS = 'CURRENT_USER_SUCCESS'
export const CURRENT_USER_FAILURE = 'CURRENT_USER_FAILURE'

/**
 * Request current user info 
 */
export const loadCurrentUser = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/current/`,
            method: 'GET',
            types: [CURRENT_USER_REQUEST, CURRENT_USER_SUCCESS, CURRENT_USER_FAILURE],
        }
})


/**
 * Update user password
 */

export const UPDATE_PASSWORD_REQUEST = 'UPDATE_PASSWORD_REQUEST'
export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS'
export const UPDATE_PASSWORD_FAILURE = 'UPDATE_PASSWORD_FAILURE'

/**
 * Request to update user password
 * @param songId ID of the song to add
 */
export const updatePassword = (userId, oldPassword, newPassword) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/${userId}/`,
            method: 'PUT',
            json: {
                old_password: oldPassword,
                password: newPassword
            },
            types: [
                UPDATE_PASSWORD_REQUEST,
                UPDATE_PASSWORD_SUCCESS,
                UPDATE_PASSWORD_FAILURE,
            ]
        }
})
