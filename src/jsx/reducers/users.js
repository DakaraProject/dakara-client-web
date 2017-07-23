import { CURRENT_USER_REQUEST, CURRENT_USER_SUCCESS, CURRENT_USER_FAILURE } from '../actions'


/**
 * Part of the state storing the logged in user info
 */

function users(state = null, action) {
    switch (action.type) {
        case CURRENT_USER_SUCCESS:
            return action.response

        default:
            return state
    }
}

export default users
