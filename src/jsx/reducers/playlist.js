import PropTypes from 'prop-types'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from 'actions/playlistApp'
import { PLAYLIST_PLAYED_REQUEST, PLAYLIST_PLAYED_SUCCESS, PLAYLIST_PLAYED_FAILURE } from 'actions/playlistApp'
import { PLAYLIST_PLAYED_ADD, PLAYLISTAPP_DIGEST_SUCCESS } from 'actions/playlistApp'
import { playlistEntryPropType, playlistPlayedEntryPropType } from 'serverPropTypes/playlist'
import { Status } from './alterationsStatus'
import { updateData } from 'utils'

/**
 * This reducer contains playlist related state
 */

/**
 * Playlist from server
 */

export const playlistEntriesStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        count: PropTypes.number.isRequired,
        playlistEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    }).isRequired,
})

const defaultEntries = {
    status: null,
    data: {
        count: 0,
        playlistEntries: []
    },
}

export function entries(state = defaultEntries, action) {
    switch (action.type) {
        case PLAYLIST_REQUEST:
            return {
                ...state,
                status: Status.pending,
            }

        case PLAYLIST_SUCCESS:
            return {
                status: Status.successful,
                data: updateData(action.response, 'playlistEntries'),
            }

        case PLAYLIST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        default:
            return state
    }
}

export const playlistPlayedEntriesStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        count: PropTypes.number.isRequired,
        playlistPlayedEntries: PropTypes.arrayOf(
            playlistPlayedEntryPropType
        ).isRequired,
    }).isRequired,
})

const defaultPlayedEntries = {
    status: null,
    data: {
        count: 0,
        playlistPlayedEntries: []
    },
}

export function playedEntries(state = defaultPlayedEntries, action) {
    switch (action.type) {
        case PLAYLIST_PLAYED_REQUEST:
            return {
                ...state,
                status: Status.pending,
            }

        case PLAYLIST_PLAYED_SUCCESS:
            return {
                data: updateData(action.response, 'playlistPlayedEntries'),
                status: Status.successful,
            }

        case PLAYLIST_PLAYED_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        // when the player has finished to play an entry, add it to the played
        // entries
        case PLAYLIST_PLAYED_ADD:
            return {
                ...state,
                data: {
                    ...state.data,
                    playlistPlayedEntries: [
                        ...state.data.playlistPlayedEntries,
                        action.entry
                    ]
                }
            }

        // when the kara status is set to stop, reset the played entries
        case PLAYLISTAPP_DIGEST_SUCCESS:
            if (action.response.kara_status.status === 'stop') {
                return defaultPlayedEntries
            }

            return state

        default:
            return state
    }
}
