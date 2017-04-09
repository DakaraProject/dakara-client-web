import { CALL_API } from 'redux-api-middleware'
import utils from '../utils'

const { baseUrl } = utils.params

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
    [CALL_API]: {
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
    [CALL_API]: {
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
    [CALL_API]: {
            endpoint: `${baseUrl}playlist/`,
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
    [CALL_API]: {
            endpoint: `${baseUrl}playlist/${entryId}/`,
            method: 'DELETE',
            types: [
                REMOVEPLAYLISTENTRY_REQUEST,
                REMOVEPLAYLISTENTRY_SUCCESS,
                {
                    type: REMOVEPLAYLISTENTRY_FAILURE,
                    meta: {delayedAction: {
                        action: clearPlaylistEntryNotification(entryId),
                        delay: 5000
                    }}
                },
            ],
            meta: { entryId }
        }
})

/**
 * Get player status 
 */

export const PLAYERSTATUS_REQUEST = 'PLAYERSTATUS_REQUEST'
export const PLAYERSTATUS_SUCCESS = 'PLAYERSTATUS_SUCCESS'
export const PLAYERSTATUS_FAILURE = 'PLAYERSTATUS_FAILURE'

/**
 * Request player status 
 */
export const loadPlayerStatus = () => ({
    [CALL_API]: {
            endpoint: `${baseUrl}playlist/player/`,
            method: 'GET',
            types: [PLAYERSTATUS_REQUEST, PLAYERSTATUS_SUCCESS, PLAYERSTATUS_FAILURE],
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
    [CALL_API]: {
            endpoint: `${baseUrl}playlist/player/manage/`,
            method: 'PUT',
            json: commands,
            types: [PLAYERCOMMANDS_REQUEST, PLAYERCOMMANDS_SUCCESS, PLAYERCOMMANDS_FAILURE],
        }
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
    [CALL_API]: {
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
