import { ALTERATION_SUCCESS } from 'actions/alterations'
import { LOGOUT, SET_TOKEN } from 'actions/token'


/**
 * Authentication token with the Dakara server
 */

function token(state = null, action) {
    switch (action.type) {
        case ALTERATION_SUCCESS:
            // log in with the form
            if (action.alterationName === 'login') {
                return action.response.token
            }

            return state

        case SET_TOKEN:
            // log in with a special event
            return action.token

        case LOGOUT:
            return null

        default:
            return state
    }
}

export default token
