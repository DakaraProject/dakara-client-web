import { combineReducers } from 'redux'
import { USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE } from '../actions'
import { USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAILURE } from '../actions'
import { USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE } from '../actions'
import { CLEAR_USERS_ENTRY_NOTIFICATION } from '../actions'
import { USER_CLEAR } from '../actions'

const defaultEntries = {
    data: {
        count: 0,
        results: []
    },
    isFetching: false
}

/**
 * List of users
 */

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
 * Delete user message
 */

function notifications(state = {}, action) {
    let userId
    switch (action.type) {
        case USER_DELETE_REQUEST:
            userId = action.userId
            return {...state, [userId]: {
                    message: "Deleting...",
                    type: "success"
                }
            }

        case USER_DELETE_SUCCESS:
            userId = action.userId
            return {...state, [userId]: {
                    message: "Successfuly deleted!",
                    type: "success"
                }
            }

        case USER_DELETE_FAILURE:
            userId = action.userId
            return {...state, [userId]: {
                    message: "Error attempting to delete user",
                    type: "danger"
                }
            }

        case CLEAR_USERS_ENTRY_NOTIFICATION:
            userId = action.userId
            let newState = { ...state }
            delete newState[userId]
            return newState

        default:
            return state
    }
}


function userEdit(state = null, action) {
    switch(action.type) {
        case USER_GET_SUCCESS:
            return action.response

        case USER_CLEAR:
            return null

        default:
            return state
    }
}

const users = combineReducers({
    entries,
    notifications,
    userEdit
})

export default users
