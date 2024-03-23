import PropTypes from 'prop-types'
import { combineReducers } from 'redux'

import { ALTERATION_SUCCESS } from 'actions/alterations'
import {
    PLAYER_ERRORS_FAILURE,
    PLAYER_ERRORS_REQUEST,
    PLAYER_ERRORS_SUCCESS,
    PLAYER_TOKEN_FAILURE,
    PLAYER_TOKEN_REQUEST,
    PLAYER_TOKEN_SUCCESS,
    PLAYLIST_DIGEST_FAILURE,
    PLAYLIST_DIGEST_REQUEST,
    PLAYLIST_DIGEST_SUCCESS,
    PLAYLIST_ENTRIES_FAILURE,
    PLAYLIST_ENTRIES_REQUEST,
    PLAYLIST_ENTRIES_SUCCESS,
} from 'actions/playlist'
import { Status } from 'reducers/alterationsResponse'
import live from 'reducers/playlistLive'
import {
    karaokePropType,
    playerErrorPropType,
    playerStatusPropType,
    playerTokenPropType,
    playlistEntryPropType,
} from 'serverPropTypes/playlist'
import { updateData } from 'utils'


/**
 * This reducer contains playlist related state
 */


/**
 * Generators for playlist entries
 */

const generatePlaylistEntriesPropType = (
    playlistEntriesPropType,
    playlistEntriesKey
) => (
    PropTypes.shape({
        status: PropTypes.symbol,
        data: PropTypes.shape({
            pagination: PropTypes.shape({
                current: PropTypes.number.isRequired,
                last: PropTypes.number.isRequired,
            }).isRequired,
            count: PropTypes.number.isRequired,
            [playlistEntriesKey]: PropTypes.arrayOf(playlistEntriesPropType).isRequired,
        }),
    })
)

const generateDefaultPlaylistEntries = (playlistEntriesKey) => ({
    status: null,
    data: {
        pagination: {
            current: 1,
            last: 1,
        },
        count: 0,
        [playlistEntriesKey]: []
    },
})

const generatePlaylistEntriesReducer = playlistEntriesType => {
    const defaultPlaylistEntries = generateDefaultPlaylistEntries(playlistEntriesType)

    return (state = defaultPlaylistEntries, action) => {
        if (action.playlistEntriesType !== playlistEntriesType) {
            return state
        }

        switch (action.type) {
            case PLAYLIST_ENTRIES_REQUEST:
                return {
                    ...state,
                    status: Status.pending,
                }

            case PLAYLIST_ENTRIES_SUCCESS:
                return {
                    status: Status.successful,
                    data: updateData(action.response, playlistEntriesType),
                }

            case PLAYLIST_ENTRIES_FAILURE:
                return {
                    status: Status.failed,
                    data: defaultPlaylistEntries.data,
                }

            default:
                return state
        }
    }
}

/**
 * Playlist of queuing entries
 */

export const queuingStatePropType = generatePlaylistEntriesPropType(
    playlistEntryPropType,
    'queuing'
)
const queuing = generatePlaylistEntriesReducer('queuing')

/**
 * playlist of played entries
 */

export const playedStatePropType = generatePlaylistEntriesPropType(
    playlistEntryPropType,
    'played'
)
const played = generatePlaylistEntriesReducer('played')

/**
 * Player information from server
 */

export const playerStatusStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: playerStatusPropType.isRequired,
})

const defaultPlayerStatus = {
    status: null,
    data: {
        playlist_entry: null,
        timing: 0,
        paused: false,
        in_transition: false,
        date: new Date().toString(),
    }
}

function playerStatus(state = defaultPlayerStatus, action) {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending
            }

        case PLAYLIST_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response.player_status,
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        // if a pause command has been successfuly sent to the server,
        // adapt the state now
        case ALTERATION_SUCCESS:
            if (action.alterationName === 'sendPlayerCommand') {
                switch (action.elementId) {
                    case 'pause':
                        return {
                            ...state,
                            data: {
                                ...state.data,
                                paused: true,
                            }
                        }

                    case 'resume':
                        return {
                            ...state,
                            data: {
                                ...state.data,
                                paused: false,
                            }
                        }

                    default:
                        return state
                }
            }

            return state

        default:
            return state
    }
}

/**
 * Player errors reported from device
 */

export const playerErrorsStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        pagination: PropTypes.shape({
            current: PropTypes.number.isRequired,
            last: PropTypes.number.isRequired,
        }).isRequired,
        count: PropTypes.number.isRequired,
        playerErrors: PropTypes.arrayOf(playerErrorPropType).isRequired,
    }),
})

const defaultPlayerErrors = {
    status: null,
    data: {
        pagination: {
            current: 1,
            last: 1,
        },
        count: 0,
        playerErrors: []
    }
}

function playerErrors(state = defaultPlayerErrors, action) {
    switch (action.type) {
        case PLAYER_ERRORS_REQUEST:
            return {
                ...state,
                status: Status.pending
            }

        case PLAYER_ERRORS_SUCCESS:
            return {
                status: Status.successful,
                data: updateData(action.response, 'playerErrors'),
            }

        case PLAYER_ERRORS_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        default:
            return state
    }
}

/**
 * Karaoke information
 */

export const karaokeStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: karaokePropType.isRequired,
})

const defaultKaraoke = {
    status: null,
    data: {
        id: null,
        ongoing: false,
        can_add_to_playlist: false,
        player_play_next_song: false,
        date_stop: null
    }
}

function karaoke(state = defaultKaraoke, action) {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending
            }

        case PLAYLIST_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response.karaoke,
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        default:
            return state
    }
}

/**
 * Player token
 */

export const playerTokenStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: playerTokenPropType.isRequired,
})

const defaultPlayerToken = {
    status: null,
    data: {
        karaoke_id: null,
        key: null,
    },
}

function playerToken(state = defaultPlayerToken, action) {
    switch (action.type) {
        case PLAYER_TOKEN_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending,
            }

        case PLAYER_TOKEN_SUCCESS:
            return {
                status: Status.successful,
                data: action.response,
            }

        case PLAYER_TOKEN_FAILURE:
            // if the player token doesn't exist
            // TODO change to low level check
            if (action.error.detail === 'Not found.') {
                return {
                    status: Status.successful,
                    data: {
                        token: null,
                    }
                }
            }

            return {
                ...state,
                status: Status.failed,
            }

        case ALTERATION_SUCCESS:
            // if the player token has been revoked
            if (action.alterationName === 'revokePlayerToken') {
                return {
                    status: Status.successful,
                    data: {
                        token: null,
                    }
                }
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
    queuing,
    played,
    playerStatus,
    playerErrors,
    karaoke,
    playerToken,
    live,
})

export default playlist
