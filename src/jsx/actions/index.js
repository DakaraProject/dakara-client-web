import { stringify } from 'query-string'
import { FETCH_API } from 'middleware/fetchApi'
import utils from 'utils'

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

/**
 * Clear the notification for the given song
 * @param songId the ID of the song to clear the notification
 */
export const clearSongListNotification = (songId) => ({
    type: ALTERATION_STATUS_CLEAR,
    alterationName: "addSongToPlaylist",
    elementId: songId,
})

/**
 * Add song to playlist
 */

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
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: [
                loadPlaylist()
            ],
        },
    alterationName: "addSongToPlaylist",
    elementId: songId,
})

/**
 * Clear playlist entry notification
 */

/**
 * Clear the notification for the given playlist entry 
 * @param entryId the ID of the entry to clear the notification from
 */
export const clearPlaylistEntryNotification = (entryId) => ({
    type: ALTERATION_STATUS_CLEAR,
    alterationName: "removeEntryFromPlaylist",
    elementId: entryId,
})

/**
 * Remove song from playlist
 */

/**
 * Request to remove an entry from the playlist
 * @param entryId Id of the entry to remove
 */
export const removeEntryFromPlaylist = (entryId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/${entryId}/`,
            method: 'DELETE',
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE,
            ],
            onSuccess: [
                loadPlaylist(),
            ],
        },
    alterationName: "removeEntryFromPlaylist",
    elementId: entryId,
})

/**
 * Get player status
 */

export const PLAYER_STATUS_REQUEST = 'PLAYER_STATUS_REQUEST'
export const PLAYER_STATUS_SUCCESS = 'PLAYER_STATUS_SUCCESS'
export const PLAYER_STATUS_FAILURE = 'PLAYER_STATUS_FAILURE'

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
export const sendPlayerCommands = (commands) => ({
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
 * Forms
 */

export const FORM_REQUEST = 'FORM_REQUEST'
export const FORM_SUCCESS = 'FORM_SUCCESS'
export const FORM_FAILURE = 'FORM_FAILURE'
export const FORM_CLEAR = 'FORM_CLEAR'
export const FORM_SET_VALIDATION_ERRORS = 'FORM_SET_VALIDATION_ERRORS'

/**
 * Generic form submit
 * @param 
 */
export const submitForm = (formName, endpoint, method, json) => {
    return {
        [FETCH_API]: {
                endpoint: baseUrl + endpoint,
                method,
                json,
                types: [
                    FORM_REQUEST,
                    FORM_SUCCESS,
                    FORM_FAILURE,
                ],
            },
        formName,
    }
}

/** Clear form notifications and errors
 * @param formName name of the form
 */
export const clearForm = (formName) => ({
    type: FORM_CLEAR,
    formName
})

/** Set validation errors on a form 
 * @param formName name of the form
 * @param global global validation error message
 * @param fields field level errors for each field
 */
export const setFormValidationErrors = (formName, global, fields) => ({
    type: FORM_SET_VALIDATION_ERRORS,
    formName,
    error: {
        non_field_errors: global,
        ...fields
    }
})

/**
 * Get user list
 */

export const USER_LIST_REQUEST = "USER_LIST_REQUEST"
export const USER_LIST_SUCCESS = "USER_LIST_SUCCESS"
export const USER_LIST_FAILURE = "USER_LIST_FAILURE"

/**
 * Action creator to refresh users in the current page
 */
const refreshUsers = (dispatch, getState) => {
    const page = getState().users.entries.data.current
    return dispatch(getUsers(page))
}

const refreshUsersDelayed = (dispatch, getState) => {
    const page = getState().users.entries.data.current
    return dispatch(delay(getUsers(page), 3000))
}

/**
 * Request to retrieve user list
 * @param page page to display
 */
export const getUsers = (page = 1) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/?page=${page}`,
            method: 'GET',
            types: [USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE],
        }
})

/**
 * Delete user
 */

/**
 * Request to delete one user
 * @param userId ID of user to delete
 */
export const deleteUser = (userId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/${userId}/`,
            method: 'DELETE',
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE,
            ],
            onSuccess: [
                refreshUsersDelayed,
            ],
        },
    alterationName: "deleteUser",
    elementId: userId
})

/**
 * Clear users entry notification
 */

/**
 * Clear one nofitication
 * @param userId line to clear
 */
export const clearUsersEntryNotification = (userId) => ({
    type: ALTERATION_STATUS_CLEAR,
    alterationName: "deleteUser",
    elementId: userId
})

/**
 * Get one user
 */

export const USER_GET_REQUEST = "USER_GET_REQUEST"
export const USER_GET_SUCCESS = "USER_GET_SUCCESS"
export const USER_GET_FAILURE = "USER_GET_FAILURE"
export const USER_CLEAR = "USER_CLEAR"


/**
 * Fetch a user
 * @param userId ID of user to get
 */
export const getUser = (userId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/${userId}/`,
            method: 'GET',
            types: [USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE],
        },
})

export const clearUser = () => ({
    type: USER_CLEAR
})

/**
 * Get tag list
 */

export const TAG_LIST_REQUEST = "TAG_LIST_REQUEST"
export const TAG_LIST_SUCCESS = "TAG_LIST_SUCCESS"
export const TAG_LIST_FAILURE = "TAG_LIST_FAILURE"

/**
 * Request to retrieve song tag list
 * @param page page to display
 */
export const getSongTagList = (page = 1) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}library/song-tags/?page=${page}`,
            method: 'GET',
            types: [TAG_LIST_REQUEST, TAG_LIST_SUCCESS, TAG_LIST_FAILURE],
        }
})

/**
 * Edit song tag
 */

/**
 * Request to update song tag
 * @param disabled
 */
export const editSongTag = (tagId, disabled) => ({
    [FETCH_API]: {
        endpoint: `${baseUrl}library/song-tags/${tagId}/`,
        method: 'PATCH',
        json: {disabled},
        types: [ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE],
    },
    alterationName: "editSongTag",
    elementId: tagId,
})

/**
 * Clear tag list entry notification
 */

/**
 * Clear one tag nofitication
 * @param tagId line to clear
 */
export const clearTagListEntryNotification = (tagId) => ({
    type: ALTERATION_STATUS_CLEAR,
    alterationName: "editSongTag",
    elementId: tagId,
})

/**
 * Alteration status
 */

export const ALTERATION_REQUEST = "ALTERATION_REQUEST"
export const ALTERATION_SUCCESS = "ALTERATION_SUCCESS"
export const ALTERATION_FAILURE = "ALTERATION_FAILURE"
export const ALTERATION_STATUS_CLEAR = "ALTERATION_STATUS_CLEAR"
