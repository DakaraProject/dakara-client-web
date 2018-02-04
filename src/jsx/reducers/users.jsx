import { combineReducers } from 'redux'
import { USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE } from 'actions'
import { USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE } from 'actions'
import { USER_CLEAR } from 'actions'

/**
 * List of users
 */

const defaultEntries = {
    data: {
        count: 0,
        results: []
    },
    isFetching: false
}

function entries(state = defaultEntries, action) {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { ...state, isFetching: true }

        case USER_LIST_SUCCESS:
            return { data: action.response, isFetching: false }

        case USER_LIST_FAILURE:
            return { ...state, isFetching: false }

        default:
            return state
    }
}

/**
 * Edit one user
 */

const defaultUserEdit = {
    user: null,
    isFetching: false
}

function userEdit(state = defaultUserEdit, action) {
    switch(action.type) {
        case USER_GET_REQUEST:
            return {
                ...state,
                isFetching: true
            }

        case USER_GET_SUCCESS:
            return {
                user: action.response,
                isFetching: false
            }

        case USER_GET_FAILURE:
            return {
                ...state,
                isFetching: false
            }

        case USER_CLEAR:
            return defaultUserEdit

        default:
            return state
    }
}

const users = combineReducers({
    entries,
    userEdit
})

export default users
