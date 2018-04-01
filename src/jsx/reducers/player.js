import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import playlist from './playlist'
import { PLAYER_DIGEST_REQUEST, PLAYER_DIGEST_SUCCESS, PLAYER_DIGEST_FAILURE } from 'actions/player'
import { PLAYER_COMMANDS_REQUEST, PLAYER_COMMANDS_SUCCESS, PLAYER_COMMANDS_FAILURE } from 'actions/player'
import { FORM_SUCCESS } from 'actions/forms'
import { Status, handleFailureMessage, alterationsStatusPropType } from './alterationsStatus'
import { playlistEntryPropType, playerStatusPropType, playerManagePropType, playerErrorPropType, karaStatusPropType } from 'serverPropTypes/playlist'
import { alterationStatusPropType } from './alterationsStatus'

/**
 * This reducer contains player related state
 */

/**
 * Player information digest from server
 */

export const playerDigestPropType = PropTypes.shape({
    data: PropTypes.shape({
        player_status: playerStatusPropType.isRequired,
        player_manage: playerManagePropType.isRequired,
        player_errors: PropTypes.arrayOf(playerErrorPropType).isRequired,
        kara_status: karaStatusPropType.isRequired,
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
    fetchError: PropTypes.bool.isRequired,
})

const defaultPlayerDigest = {
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
    isFetching: false,
    fetchError: false
}

function digest(state = defaultPlayerDigest, action) {
    switch (action.type) {
        case PLAYER_DIGEST_REQUEST:
            return {
                ...state,
                isFetching: true
            }

        case PLAYER_DIGEST_SUCCESS:
            return {
                data: action.response,
                isFetching: false,
                fetchError: false
            }

        case PLAYER_DIGEST_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetchError: true
            }

        case PLAYER_COMMANDS_SUCCESS:
            if (action.commands &&
                action.commands.pause != undefined) {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        player_manage: {
                            ...state.data.player_manage,
                            pause: action.commands.pause
                        }
                    }
                }
            }

            return state

        case FORM_SUCCESS:
            if (action.formName == "editKaraStatus") {
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
 * Player skip and pause management
 */

const defaultPlayerCommand = {
    status: null,
    message: "",
}

const generatePlayerCommandReducer = commandName => (state = defaultPlayerCommand, action) => {
    if (!(action.commands && typeof(action.commands[commandName]) != 'undefined')) {
        return state
    }

    switch (action.type) {
        case PLAYER_COMMANDS_REQUEST:
            return {
                status: Status.pending
            }

        case PLAYER_COMMANDS_SUCCESS:
            return {
                status: Status.successful
            }

        case PLAYER_COMMANDS_FAILURE:
            return {
                status: Status.failed,
                message: handleFailureMessage(action)
            }

        default:
            return state
    }
}

export const playerCommandsPropType = PropTypes.shape({
    pause: alterationStatusPropType.isRequired,
    skip: alterationStatusPropType.isRequired,
})

const commands = combineReducers({
    pause: generatePlayerCommandReducer('pause'),
    skip: generatePlayerCommandReducer('skip')
})

/**
 * Player
 */

const player = combineReducers({
    digest,
    playlist,
    commands,
})

export default player
