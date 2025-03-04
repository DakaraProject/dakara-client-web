import queryString from 'query-string'

import {
    ALTERATION_FAILURE,
    ALTERATION_REQUEST,
    ALTERATION_SUCCESS
} from 'actions/alterations'
import { loadPlaylistDigest } from 'actions/playlistDigest'
import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params


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
            endpoint: `${baseUrl}/playlist/queuing/${entryId}/`,
            method: 'DELETE',
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE,
            ],
        },
    alterationName: 'removeEntryFromPlaylist',
    elementId: entryId,
})

/**
 * Get playlist entries
 */

export const PLAYLIST_ENTRIES_REQUEST = 'PLAYLIST_ENTRIES_REQUEST'
export const PLAYLIST_ENTRIES_SUCCESS = 'PLAYLIST_ENTRIES_SUCCESS'
export const PLAYLIST_ENTRIES_FAILURE = 'PLAYLIST_ENTRIES_FAILURE'

/**
 * Request playlist entries
 * @param type Type of the playlist requested.
 */
export const loadPlaylistEntries = (playlistEntriesType, { page = 1 } = {}) => {
    const queryString = queryString.stringify({
        ...(page) && {page},
    })

    return {
        [FETCH_API]: {
                endpoint: `${baseUrl}/playlist/${playlistEntriesType}/?${queryString}`,
                method: 'GET',
                types: [
                    PLAYLIST_ENTRIES_REQUEST,
                    PLAYLIST_ENTRIES_SUCCESS,
                    PLAYLIST_ENTRIES_FAILURE
                ],
            },
        playlistEntriesType,
    }
}

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
            endpoint: `${baseUrl}/playlist/played/`,
            method: 'GET',
            types: [
                PLAYLIST_PLAYED_REQUEST,
                PLAYLIST_PLAYED_SUCCESS,
                PLAYLIST_PLAYED_FAILURE
            ],
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
            endpoint: `${baseUrl}/playlist/queuing/`,
            method: 'POST',
            json: {song_id: songId},
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: [
                loadPlaylistDigest()
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
            endpoint: `${baseUrl}/playlist/queuing/`,
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
                loadPlaylistDigest()
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
                endpoint: `${baseUrl}/playlist/queuing/${playlistEntryId}/`,
                method: 'PUT',
                json,
                types: [
                    ALTERATION_REQUEST,
                    ALTERATION_SUCCESS,
                    ALTERATION_FAILURE
                ],
                onSuccess: [
                    loadPlaylistDigest(),
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

/**
 * Player errors
 */

export const PLAYER_ERRORS_REQUEST = 'PLAYER_ERRORS_REQUEST'
export const PLAYER_ERRORS_SUCCESS = 'PLAYER_ERRORS_SUCCESS'
export const PLAYER_ERRORS_FAILURE = 'PLAYER_ERRORS_FAILURE'

/**
 * Load player token
 * @param karaokeId ID of the karaoke object
 */
export const loadPlayerErrors = ({ page = 1 } = {}) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/playlist/player/errors/?page=${page}`,
            method: 'GET',
            types: [
                PLAYER_ERRORS_REQUEST,
                PLAYER_ERRORS_SUCCESS,
                PLAYER_ERRORS_FAILURE
            ],
    }
})
