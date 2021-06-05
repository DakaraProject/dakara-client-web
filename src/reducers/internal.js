import { combineReducers } from 'redux'
import { SERVER_SETTINGS_SUCCESS } from 'actions/internal'

/**
 * Part of the state storing the server settings
 */

function serverSettings(state = null, action) {
    switch (action.type) {
        case SERVER_SETTINGS_SUCCESS:
            return action.response

        default:
            return state
    }
}

export default combineReducers({ serverSettings })
