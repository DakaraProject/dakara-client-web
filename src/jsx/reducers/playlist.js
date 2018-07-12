import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import { PLAYLIST_DIGEST_REQUEST, PLAYLIST_DIGEST_SUCCESS, PLAYLIST_DIGEST_FAILURE } from 'actions/playlist'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from 'actions/playlist'
import { PLAYLIST_PLAYED_REQUEST, PLAYLIST_PLAYED_SUCCESS, PLAYLIST_PLAYED_FAILURE } from 'actions/playlist'
import { PLAYLIST_PLAYED_ADD } from 'actions/playlist'
import { ALTERATION_SUCCESS } from 'actions/alterations'
import { DEVICE_NEW_ENTRY, DEVICE_IDLE, DEVICE_ENTRY_ERROR, DEVICE_STATUS, DEVICE_ENTRY_STARTED } from 'actions/playlist'
import { KARA_STATUS, PLAYLIST_ADD, PLAYLIST } from 'actions/playlist'
import { WEBSOCKET_OPEN, WEBSOCKET_CLOSE, WEBSOCKET_LOST } from 'middleware/websocket'
import { Status } from './alterationsResponse'
import { playerStatusPropType, playerManagePropType, playerErrorPropType, karaStatusPropType } from 'serverPropTypes/playlist'
import { playlistEntryPropType, playlistPlayedEntryPropType } from 'serverPropTypes/playlist'
import { updateData } from 'utils'


/**
 * This reducer contains playlist related state
 */


const getDefaultPlayerStatus = () => ({
    status: null,
    date: new Date(),
    data: {
        currentEntry: null,
        inTransition: false,
        paused: false,
        timing: 0,
    }
})

const defaultKaraStatus = {
    status: null,
    data: {
        status: null,
    }
}

const defaultEntryErrors = {
    status: null,
    data: []
}

const playerStatus = (state = getDefaultPlayerStatus(), action) => {
    switch (action.type) {
        case DEVICE_NEW_ENTRY:
            return {
                status: Status.successful,
                date: action.date,
                data: {
                    currentEntry: action.data,
                    paused: false,
                    inTransition: true,
                    timing: 0,
                }
            }

        case DEVICE_ENTRY_STARTED:
            return {
                status: Status.successful,
                date: action.date,
                data: {
                    currentEntry: action.data,
                    paused: false,
                    inTransition: false,
                    timing: 0,
                }
            }

        case DEVICE_ENTRY_ERROR:
            return {
                ...getDefaultPlayerStatus(),
                status: Status.successful,
                date: action.date,
            }

        case DEVICE_IDLE:
            return {
                ...getDefaultPlayerStatus(),
                status: Status.successful,
                date: action.date,
            }

        case DEVICE_STATUS:
            return {
                status: Status.successful,
                date: action.date,
                data: {
                    currentEntry: action.data.entry,
                    paused: action.data.paused,
                    timing: action.data.timing,
                    inTransition: action.data.in_transition
                }
            }

        case KARA_STATUS:
            if (action.data.status !== 'stop') return state

            return {
                ...state,
                ...getDefaultPlayerStatus(),
                date: action.date,
            }

        default:
            return state
    }
}

const karaStatus = (state = defaultKaraStatus, action) => {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: Status.pending,
            }

        case PLAYLIST_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response.kara_status
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        case KARA_STATUS:
            return {
                status: Status.successful,
                data: action.data
            }

        // if the kara status has been successfuly edited, adapt the state now
        case ALTERATION_SUCCESS:
            if (action.alterationName == "editKaraStatus") {
                return {
                    ...state,
                    data: {
                        status: action.response.status
                    }
                }
            }

        default:
            return state
    }
}

const entryErrors = (state = defaultEntryErrors, action) => {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: Status.pending,
            }

        case PLAYLIST_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response.player_errors
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed
            }

        case DEVICE_ENTRY_ERROR:
            return {
                status: Status.successful,
                data: [
                    ...state.data,
                    action.data,
                ]
            }

        default:
            return state
    }
}


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
                status: state.status || Status.pending,
            }

        case PLAYLIST_SUCCESS:
            return {
                status: Status.successful,
                data: {
                    date_end: action.response.date_end,
                    playlistEntries: action.response.entries
                }
            }

        case PLAYLIST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        case PLAYLIST:
            return {
                status: Status.successful,
                data: {
                    date_end: action.data.date_end,
                    playlistEntries: action.data.entries
                }
            }

        case PLAYLIST_ADD:
            return {
                status: Status.successful,
                data: {
                    date_end: action.data.date_end,
                    playlistEntries: [
                        ...state.data.playlistEntries,
                        action.data.entry
                    ]
                }
            }

        // if the player plays a new entry, remove it from the playlist
        case DEVICE_NEW_ENTRY:
            console.log("removing current entry from playlist")
            const entryIdx = state.data.playlistEntries.findIndex(e => (e.id === action.data.id))
            return {
                ...state,
                data: {
                    ...state.data,
                    playlistEntries: [
                        ...state.data.playlistEntries.slice(0, entryIdx),
                        ...state.data.playlistEntries.slice(
                            entryIdx + 1, state.data.playlistEntries.length
                        )
                    ]
                }
            }

        // when the kara status is set to stop, reset the entries
        case KARA_STATUS:
            if (action.data.status === 'stop') {
                return defaultEntries
            }

            return state

        // when the kara status is set to stop, reset the entries
        case ALTERATION_SUCCESS:
            if (action.alterationName == "editKaraStatus"
                && action.response.status === 'stop') {

                return defaultEntries
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
            console.log("adding current entry to played playlist")
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

        // when an entry failed, add it directly to the played entries
        case DEVICE_ENTRY_ERROR:
            return {
                ...state,
                data: {
                    ...state.data,
                    playlistPlayedEntries: [
                        ...state.data.playlistPlayedEntries,
                        action.data.entry,
                    ]
                }
            }

        // when the kara status is set to stop, reset the played entries
        case KARA_STATUS:
            if (action.data.status === 'stop') {
                return defaultPlayedEntries
            }

            return state

        // when the kara status is set to stop, reset the played entries
        case ALTERATION_SUCCESS:
            if (action.alterationName == "editKaraStatus"
                && action.response.status === 'stop') {

                return defaultPlayedEntries
            }

        default:
            return state
    }
}

/*
 * WebSocket connection
 */

const defaultWebSocketConnection = {
    status: null
}

const webSocketConnection = (state = defaultWebSocketConnection, action) => {
    if (action.endpoint !== '/ws/playlist/front/') return state

    switch (action.type) {
        case WEBSOCKET_OPEN:
            return {
                status: Status.successful
            }

        case WEBSOCKET_CLOSE:
            return defaultWebSocketConnection

        case WEBSOCKET_LOST:
            return {
                status: Status.failed
            }

        default:
            return state
    }
}



/**
 * Playlist
 */

const playlist = combineReducers({
    playerStatus,
    karaStatus,
    entryErrors,
    entries,
    playedEntries,
    webSocketConnection,
    digest,
})

export default playlist
