import { combineReducers } from 'redux'
import playlist from './playlist'
import { PLAYERSTATUS_REQUEST, PLAYERSTATUS_SUCCESS, PLAYERSTATUS_FAILURE } from '../actions'
import { PLAYERCOMMANDS_REQUEST, PLAYERCOMMANDS_SUCCESS, PLAYERCOMMANDS_FAILURE } from '../actions'
import { CREATE_PLAYER_NOTIFICATION, CLEAR_PLAYER_NOTIFICATION } from '../actions'

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
    isFetching: false
}

function status(state = defaultPlayerStatus, action) {
    switch (action.type) {
        case PLAYERSTATUS_REQUEST:
            return { ...state, isFetching: true }

        case PLAYERSTATUS_SUCCESS:
            return { data: action.payload, isFetching: false }

        case PLAYERSTATUS_FAILURE:
            return { ...state, isFetching: false }

        case PLAYERCOMMANDS_SUCCESS:
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
 * Player skip management
 */

const defaultSkip = {
    pending: false,
    error: false
}

function skip(state = defaultSkip, action) {
    if (!(action.commands && action.commands.skip)) {
        return state
    }

    switch (action.type) {
        case PLAYERCOMMANDS_REQUEST:
            return {
                pending: true,
                error: false
            }

        case PLAYERCOMMANDS_SUCCESS:
            return {
                pending: false,
                error: false,
            }

        case PLAYERCOMMANDS_FAILURE:
            return {
                pending: false,
                error: true,
            }

        default:
            return state
    }
}

/**
 * Player pause management
 */

const defaultPause = {
    pending: false,
    error: false
}

function pause(state = defaultPause, action) {
    if (!(action.commands &&
        action.commands.pause != undefined)) {
        return state
    }

    switch (action.type) {
        case PLAYERCOMMANDS_REQUEST:
            return {
                pending: true,
                error: false
            }

        case PLAYERCOMMANDS_SUCCESS:
            return {
                pending: false,
                error: false,
            }

        case PLAYERCOMMANDS_FAILURE:
            return {
                pending: false,
                error: true,
            }

        default:
            return state
    }
}

const commands = combineReducers({
    pause,
    skip
})

/**
 * Player errors notification
 *
 * This is the error displayed in the interface
 */

function errorNotification(state = null, action) {
    switch (action.type) {
        case CREATE_PLAYER_NOTIFICATION:
            return action.error

        case CLEAR_PLAYER_NOTIFICATION:
            if (!state) {
                return null
            }

            // we delete the state and the notification only if it is the one we
            // want to remove
            if (state.id == action.errorId) {
                return null
            } else {
                return state
            }

        default:
            return state
    }
}

/**
 * Combine all the reducers
 */

const player = combineReducers({
    status,
    playlist,
    commands,
    errorNotification
})

export default player
