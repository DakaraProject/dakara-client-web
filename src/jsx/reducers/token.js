import { LOGIN_SUCCESS } from '../actions'
import { LOGOUT } from '../actions'
import { SET_TOKEN } from '../actions'


/**
 * Authentication token with the Dakara server
 */

function token(state = null, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return action.response.token

        case LOGOUT:
            return null

        case SET_TOKEN:
            return action.token

        default:
            return state
    }
}

export default token
