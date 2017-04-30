import { LOGIN_SUCCESS } from '../actions'
import { LOGOUT } from '../actions'


/**
 * Authentication token with the Dakara server
 */

function token(state = null, action) {
    if (action.type === LOGIN_SUCCESS) {
        return action.response.token
    } else if (action.type === LOGOUT) {
        return null
    } else {
        return state
    }
}

export default token
