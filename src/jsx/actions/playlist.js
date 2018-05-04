import { FETCH_API } from 'middleware/fetchApi'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE, ALTERATION_RESPONSE_CLEAR } from './alterations'
import { params } from 'utils'

const { baseUrl } = params


/**
 * Playlist app actions
 */


/**
 * Get playlist app information digest
 */

export const PLAYLIST_DIGEST_REQUEST = 'PLAYLIST_DIGEST_REQUEST'
export const PLAYLIST_DIGEST_SUCCESS = 'PLAYLIST_DIGEST_SUCCESS'
export const PLAYLIST_DIGEST_FAILURE = 'PLAYLIST_DIGEST_FAILURE'

/**
 * Request information digest
 */
export const loadPlaylistAppDigest = () => ({
    [FETCH_API]: {
        endpoint: `${baseUrl}playlist/digest/`,
        method: 'GET',
        types: [
            PLAYLIST_DIGEST_REQUEST,
            PLAYLIST_DIGEST_SUCCESS,
            PLAYLIST_DIGEST_FAILURE
        ],
        onSuccess: [addSongWhenFinished],
    }
})


/**
 * Playlist actions
 */


/**
 * Clear playlist entry notification
 */

/**
 * Clear the notification for the given playlist entry 
 * @param entryId the ID of the entry to clear the notification from
 */
export const clearPlaylistEntryNotification = (entryId) => ({
    type: ALTERATION_RESPONSE_CLEAR,
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
            endpoint: `${baseUrl}playlist/entries/${entryId}/`,
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
 * Get playlist entries
 */

export const PLAYLIST_REQUEST = 'PLAYLIST_REQUEST'
export const PLAYLIST_SUCCESS = 'PLAYLIST_SUCCESS'
export const PLAYLIST_FAILURE = 'PLAYLIST_FAILURE'

/**
 * Request playlist entries
 */
export const loadPlaylist = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/entries/`,
            method: 'GET',
            types: [PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE],
        }
})

/**
 * Get playlist played entries
 */

export const PLAYLIST_PLAYED_REQUEST = 'PLAYLIST_PLAYED_REQUEST'
export const PLAYLIST_PLAYED_SUCCESS = 'PLAYLIST_PLAYED_SUCCESS'
export const PLAYLIST_PLAYED_FAILURE = 'PLAYLIST_PLAYED_FAILURE'

/**
 * Request playlist played entries
 */
export const loadPlaylistPlayed = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/played-entries/`,
            method: 'GET',
            types: [PLAYLIST_PLAYED_REQUEST, PLAYLIST_PLAYED_SUCCESS, PLAYLIST_PLAYED_FAILURE],
        }
})


/**
 * Add entry to playlist played entries list
 */

export const PLAYLIST_PLAYED_ADD = 'PLAYLIST_PLAYED_ADD'

/**
 * Detects when a song had finished playing,
 * and generate a PLAYLIST_PLAYED_ADD action accordingly
 */
const addSongWhenFinished = (dispatch, getState, newAction) => {
    const previousEntry = getState().playlist.digest.data.player_status.playlist_entry
    const newEntry = newAction.response.player_status.playlist_entry

    // there was no song playing
    if (!previousEntry) {
        return null
    }

    // the same playlist entry is played
    if (newEntry && newEntry.id === previousEntry.id) {
        return null
    }

    // a song ended
    return dispatch({
        type: PLAYLIST_PLAYED_ADD,
        entry: previousEntry
    })
}

/**
 * Add song to playlist
 */

/**
 * Request to add a song to the playlist
 * @param songId ID of the song to add
 */
export const addSongToPlaylist = (songId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/entries/`,
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
 * Player actions
 */


/**
 * Send a command to the player
 * @param name pause or skip
 * @param value boolean value
 */
export const sendPlayerCommand = (name, value) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}playlist/player/manage/`,
            method: 'PUT',
            json: {[name]: value},
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: loadPlaylistAppDigest(),
    },
    alterationName: "sendPlayerCommands",
    elementId: name,
    value,
})
