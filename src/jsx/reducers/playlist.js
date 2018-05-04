import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import { PLAYLIST_DIGEST_REQUEST, PLAYLIST_DIGEST_SUCCESS, PLAYLIST_DIGEST_FAILURE } from 'actions/playlist'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from 'actions/playlist'
import { PLAYLIST_PLAYED_REQUEST, PLAYLIST_PLAYED_SUCCESS, PLAYLIST_PLAYED_FAILURE } from 'actions/playlist'
import { PLAYLIST_PLAYED_ADD } from 'actions/playlist'
import { ALTERATION_SUCCESS } from 'actions/alterations'
import { Status } from './alterations'
import { playerStatusPropType, playerManagePropType, playerErrorPropType, karaStatusPropType } from 'serverPropTypes/playlist'
import { playlistEntryPropType, playlistPlayedEntryPropType } from 'serverPropTypes/playlist'
import { updateData } from 'utils'


/**
 * This reducer contains playlist related state
 */


/**
 * Player information digest from server
 */


export const playlistDigestPropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        player_status: playerStatusPropType.isRequired,
        player_manage: playerManagePropType.isRequired,
        player_errors: PropTypes.arrayOf(playerErrorPropType).isRequired,
        kara_status: karaStatusPropType.isRequired,
    }).isRequired,
})

const defaultPlaylistAppDigest = {
    status: null,
    data: {
        player_status: {
            playlist_entry: null,
            timing: 0
        },
        player_manage: {
            pause: false,
            skip: false
        },
        player_errors: [],
        kara_status: {
            status: null,
        },
    },
}

function digest(state = defaultPlaylistAppDigest, action) {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending
            }

        case PLAYLIST_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response,
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        // if a pause command has been successfuly sent to the server,
        // adapt the state now
        case ALTERATION_SUCCESS:
            if (action.alterationName === 'sendPlayerCommand' &&
                action.elementId === 'pause') {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        player_manage: {
                            ...state.data.player_manage,
                            pause: action.value,
                        }
                    }
                }
            }

            return state

        // if the kara status has been successfuly edited, adapt the state now
        case ALTERATION_SUCCESS:
            if (action.alterationName == "editKaraStatus") {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        kara_status: {
                            status: action.response.status
                        }
                    }
                }
            }

        default:
            return state
    }
}


/**
 * Playlist of entries from server
 */


export const playlistEntriesStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        date_end: PropTypes.string.isRequired,
        playlistEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    }).isRequired,
})

const defaultEntries = {
    status: null,
    data: {
        date_end: "",
        playlistEntries: []
    },
}

function entries(state = defaultEntries, action) {
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


/**
 * Playlist of played entries from server
 */


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

function playedEntries(state = defaultPlayedEntries, action) {
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
        case PLAYLIST_DIGEST_SUCCESS:
            if (action.response.kara_status.status === 'stop') {
                return defaultPlayedEntries
            }

            return state

        default:
            return state
    }
}

/**
 * Playlist
 */

const playlist = combineReducers({
    digest,
    entries,
    playedEntries,
})

export default playlist
