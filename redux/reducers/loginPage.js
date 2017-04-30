import { combineReducers } from 'redux'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions'

/**
 * This reducer contains login Page state
 */

/**
 * Login Page message
 */

function message(state = null, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
        case LOGIN_SUCCESS:
            return null

        case LOGIN_FAILURE:
            const { message, non_field_errors } = action.error
            if (message) {
                return message
            }

            if (non_field_errors) {
                return non_field_errors.join(" ")
            }

            return "Unknown error."

        default:
            return state
    }
}

/**
 * Login Page loading 
 */

function isLoading(state = false, action) {
    if (action.type === LOGIN_REQUEST) {
        return !action.error
    } else if (action.type == LOGIN_SUCCESS || action.type == LOGIN_FAILURE) {
        return false
    }

    return state
}

const loginPage = combineReducers({
    message,
    isLoading
})

export default loginPage
