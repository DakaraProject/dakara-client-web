import { combineReducers } from 'redux'
import playlist from './playlist'
import { PLAYERSTATUS_REQUEST, PLAYERSTATUS_SUCCESS, PLAYERSTATUS_FAILURE } from '../actions'

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
        default:
            return state
    }
}


const player = combineReducers({
    status,
    playlist
})

export default player
