import { CURRENT_USER_REQUEST, CURRENT_USER_SUCCESS, CURRENT_USER_FAILURE } from '../actions'
import { LOGOUT } from '../actions'


/**
 * Part of the state storing the logged in user info
 */

function authenticatedUsers(state = null, action) {
    switch (action.type) {
        case CURRENT_USER_SUCCESS:
            return action.response

        case LOGOUT:
            return null

        default:
            return state
    }
}

export default authenticatedUsers
