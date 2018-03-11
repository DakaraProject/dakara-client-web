import { FORM_SUCCESS } from 'actions/forms'
import { LOGOUT } from 'actions/token'
import { SET_TOKEN } from 'actions/token'

/**
 * Authentication token with the Dakara server
 */

function token(state = null, action) {
    switch (action.type) {
        case FORM_SUCCESS:
            // special case for the login form
            if (action.formName == 'login') {
                return action.response.token
            }

            return state

        case LOGOUT:
            return null

        case SET_TOKEN:
            return action.token

        default:
            return state
    }
}

export default token
