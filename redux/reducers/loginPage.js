import { combineReducers } from 'redux'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions'

/**
 * This reducer contains login Page state
 */

/**
 * Login Page message
 */

function message(state = null, action) {
    const payload = action.payload
    if (action.type == LOGIN_REQUEST && !action.error) {
        return null
    } else if (action.type === LOGIN_FAILURE) {
        if (action.error = true && payload.name == "ApiError") {
            const errors = payload.response.non_field_errors
            if (errors && errors.length > 0) {
                return errors[0]
            } else {
                return payload.message
            }
        } else {
            return "Unknown error."
        }
    } else if (action.type == LOGIN_REQUEST && action.error == true && payload.name == "RequestError") {
        return "Unable to contact server."
    } else if (action.type == LOGIN_SUCCESS || action.type == LOGIN_FAILURE) {
        return null 
    }

    return state
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
