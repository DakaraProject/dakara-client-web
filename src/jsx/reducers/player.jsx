import { combineReducers } from 'redux'
import playlist from './playlist'
import { PLAYER_STATUS_REQUEST, PLAYER_STATUS_SUCCESS, PLAYER_STATUS_FAILURE } from 'actions/player'
import { PLAYER_COMMANDS_REQUEST, PLAYER_COMMANDS_SUCCESS, PLAYER_COMMANDS_FAILURE } from 'actions/player'
import { Status, handleFailureMessage } from './alterationsStatus'

/**
 * This reducer contains player related state
 */

/**
 * Player status from server
 */

const defaultPlayerStatus = {
    data: {
        status: {
            playlist_entry: null,
            timing: 0
        },
        manage: {
            pause: false,
            skip: false
        },
        errors: []
    },
    isFetching: false,
    fetchError: false
}

function status(state = defaultPlayerStatus, action) {
    switch (action.type) {
        case PLAYER_STATUS_REQUEST:
            return {
                ...state,
                isFetching: true
            }

        case PLAYER_STATUS_SUCCESS:
            return {
                data: action.response,
                isFetching: false,
                fetchError: false
            }

        case PLAYER_STATUS_FAILURE:
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
                        manage: {
                            ...state.data.manage,
                            pause: action.commands.pause
                        }
                    }
                }
            }

            return state

        default:
            return state
    }
}

/**
 * Player skip and pause management
 */

const defaultPlayerCommand = {
    status: null,
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

const commands = combineReducers({
    pause: generatePlayerCommandReducer('pause'),
    skip: generatePlayerCommandReducer('skip')
})

/**
 * Combine all the reducers
 */

const player = combineReducers({
    status,
    playlist,
    commands,
})

export default player
