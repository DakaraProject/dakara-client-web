import {
    ALTERATION_FAILURE,
    ALTERATION_REQUEST,
    ALTERATION_SUCCESS
} from 'actions/alterations'
import { FETCH_API } from 'middleware/fetchApi'
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
export const loadPlaylistDigest = () => ({
    [FETCH_API]: {
        endpoint: `${baseUrl}/playlist/digest/`,
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
 * Remove song from playlist
 */

/**
 * Request to remove an entry from the playlist
 * @param entryId Id of the entry to remove
 */
export const removeEntryFromPlaylist = (entryId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/entries/${entryId}/`,
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
    alterationName: 'removeEntryFromPlaylist',
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
            endpoint: `${baseUrl}/playlist/entries/`,
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
            endpoint: `${baseUrl}/playlist/played-entries/`,
            method: 'GET',
            types: [
                PLAYLIST_PLAYED_REQUEST,
                PLAYLIST_PLAYED_SUCCESS,
                PLAYLIST_PLAYED_FAILURE
            ],
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
            endpoint: `${baseUrl}/playlist/entries/`,
            method: 'POST',
            json: {song_id: songId},
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: [
                loadPlaylist()
            ],
        },
    alterationName: 'addSongToPlaylist',
    elementId: songId,
})

/**
 * Request to add a song to the playlist with options
 * @param songId ID of the song to add
 * @param useInstrumental true to request instrumental track
 */
export const addSongToPlaylistWithOptions = (songId, useInstrumental=false) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/entries/`,
            method: 'POST',
            json: {
              song_id: songId,
              use_instrumental: useInstrumental
            },
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: [
                loadPlaylist()
            ],
        },
    alterationName: 'addSongToPlaylistWithOptions',
    elementId: songId,
})


/**
 * Reorder playlist entry
 */

/**
 * Request to reorder one entry before or after a specific entry
 * @param playlistEntryId Id of the playlist entry to move
 * @param beforeId Move current entry before this entry
 * @param afterId Move current entry after this entry
 */
export const reorderPlaylistEntry = ({playlistEntryId, beforeId, afterId} = {}) => {
    // alteration element id is target entry id, since Notification is
    // displayed on target
    let targetId

    // either beforeId or afterId is given
    // if both are given, only beforeId is used
    const json = {}
    if (beforeId) {
        json.before_id = beforeId
        targetId = beforeId
    } else if (afterId) {
        json.after_id = afterId
        targetId = afterId
    } else {
        throw new Error('Either `beforeId` or `afterId` must be provided')
    }

    return {
        [FETCH_API]: {
                endpoint: `${baseUrl}/playlist/entries/${playlistEntryId}/`,
                method: 'PUT',
                json,
                types: [
                    ALTERATION_REQUEST,
                    ALTERATION_SUCCESS,
                    ALTERATION_FAILURE
                ],
                onSuccess: [
                    loadPlaylist()
                ],
            },
        alterationName: 'reorderPlaylistEntry',
        elementId: targetId,
    }
}

/**
 * Player actions
 */


/**
 * Send a command to the player
 * @param command event to send
 */
export const sendPlayerCommand = (command) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/player/command/`,
            method: 'PUT',
            json: {command},
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: loadPlaylistDigest(),
    },
    alterationName: 'sendPlayerCommands',
    elementId: command,
})

/**
 * Player token
 */

export const PLAYER_TOKEN_REQUEST = 'PLAYER_TOKEN_REQUEST'
export const PLAYER_TOKEN_SUCCESS = 'PLAYER_TOKEN_SUCCESS'
export const PLAYER_TOKEN_FAILURE = 'PLAYER_TOKEN_FAILURE'

/**
 * Load player token
 * @param karaokeId ID of the karaoke object
 */
export const loadPlayerToken = (karaokeId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/player-token/${karaokeId}/`,
            method: 'GET',
            types: [
                PLAYER_TOKEN_REQUEST,
                PLAYER_TOKEN_SUCCESS,
                PLAYER_TOKEN_FAILURE
            ],
    }
})

/**
 * Create player token, causing to reload player token of the same karaoke
 * @param karaokeId ID of the karaoke object
 */
export const createPlayerToken = (karaokeId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/player-token/`,
            method: 'POST',
            json: {karaoke: karaokeId},
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: loadPlayerToken(karaokeId),
    },
    alterationName: 'createPlayerToken',
})

/**
 * Revoke player token
 * @param karaokeId ID of the karaoke object
 */
export const revokePlayerToken = (karaokeId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/player-token/${karaokeId}/`,
            method: 'DELETE',
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],

    },
    alterationName: 'revokePlayerToken'
})
