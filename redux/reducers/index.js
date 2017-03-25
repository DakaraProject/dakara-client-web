import { LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE } from '../actions'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions'
import { WORKTYPES_REQUEST, WORKTYPES_SUCCESS, WORKTYPES_FAILURE } from '../actions'
import { LOGOUT } from '../actions'
import { combineReducers } from 'redux'


/**
 * Authentication token with the Dakara server
 */

function token(state = null, action) {
    if (action.type === LOGIN_SUCCESS) {
        return action.payload.token
    } else if (action.type === LOGOUT) {
        return null
    } else {
        return state
    }
}


/**
 * Current content of the library
 */

const defaultLibraryEntries =  {
        current: 0,
        last: 0,
        count: 0,
        results: [],
}

function entries(state = defaultLibraryEntries, action) {
    if (action.type === LIBRARY_SUCCESS) {
        return action.payload;
    } else {
        return state;
    }
}

/**
 * Work Types 
 */

const defaultWorkTypes =  {
        results: []
}

function workTypes(state = defaultWorkTypes, action) {
    if (action.type === WORKTYPES_SUCCESS) {
        return action.payload;
    } else {
        return state;
    }
}

/**
 * Library related state
 */

const library = combineReducers({
    entries,
    workTypes
})


/**
 * Login Page message
 */

function loginMessage(state = null, action) {
    const payload = action.payload
    if (action.type === LOGIN_FAILURE) {
        if (action.error = true && payload.name == "ApiError") {
            const errors = payload.response.non_field_errors
            if(errors && errors.length > 0) {
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

function loginLoading(state = false, action) {
    if (action.type === LOGIN_REQUEST) {
        return !action.error
    } else if (action.type == LOGIN_SUCCESS || action.type == LOGIN_FAILURE) {
        return false
    }

    return state
}

/**
 * Login Page state
 */

const loginPage = combineReducers({
    message: loginMessage,
    isLoading: loginLoading
})

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    loginPage
})

export default rootReducer
