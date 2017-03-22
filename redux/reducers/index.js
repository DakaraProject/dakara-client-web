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
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library
})

export default rootReducer
