import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params


/**
 * Playlist digest actions
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
 * Add entry to playlist played entries list
 */

export const PLAYLIST_PLAYED_ADD = 'PLAYLIST_PLAYED_ADD'

/**
 * Detects when a song had finished playing,
 * and generate a PLAYLIST_PLAYED_ADD action accordingly
 */
const addSongWhenFinished = (dispatch, getState, newAction) => {
    const previousEntry = getState().playlist.playerStatus.data.playlist_entry
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
