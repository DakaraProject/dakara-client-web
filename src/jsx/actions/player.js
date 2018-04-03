import { FETCH_API } from 'middleware/fetchApi'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE, ALTERATION_CLEAR } from './alterationsStatus'
import { params } from 'utils'

const { baseUrl } = params

/**
 * Clear playlist entry notification
 */

/**
 * Clear the notification for the given playlist entry 
 * @param entryId the ID of the entry to clear the notification from
 */
export const clearPlaylistEntryNotification = (entryId) => ({
    type: ALTERATION_CLEAR,
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
 * Get player information digest
 */

export const PLAYER_DIGEST_REQUEST = 'PLAYER_DIGEST_REQUEST'
export const PLAYER_DIGEST_SUCCESS = 'PLAYER_DIGEST_SUCCESS'
export const PLAYER_DIGEST_FAILURE = 'PLAYER_DIGEST_FAILURE'

/**
 * Request player information digest
 */
export const loadPlayerDigest = () => ({
    [FETCH_API]: {
        endpoint: `${baseUrl}playlist/digest/`,
        method: 'GET',
        types: [
            PLAYER_DIGEST_REQUEST,
            PLAYER_DIGEST_SUCCESS,
            PLAYER_DIGEST_FAILURE
        ],
    }
})

/**
 * Send a command to the player
 * @param name: pause or skip
 * @param value: boolean value
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
            onSuccess: loadPlayerDigest(),
    },
    alterationName: "sendPlayerCommands",
    elementId: name,
    value,
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
            endpoint: `${baseUrl}playlist/entries/`,
            method: 'GET',
            types: [PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE],
        }
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
