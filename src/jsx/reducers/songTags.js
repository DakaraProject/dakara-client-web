import { combineReducers } from 'redux'
import { TAG_LIST_REQUEST, TAG_LIST_SUCCESS, TAG_LIST_FAILURE } from '../actions'

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
        case TAG_LIST_REQUEST:
            return { ...state, isFetching: true }

        case TAG_LIST_SUCCESS:
            return { data: action.response, isFetching: false }

        case TAG_LIST_FAILURE:
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
        // case TAG_DELETE_REQUEST:
        //     userId = action.userId
        //     return {...state, [userId]: {
        //             message: "Deleting...",
        //             type: "success"
        //         }
        //     }
        //
        // case TAG_DELETE_SUCCESS:
        //     userId = action.userId
        //     return {...state, [userId]: {
        //             message: "Successfuly deleted!",
        //             type: "success"
        //         }
        //     }
        //
        // case TAG_DELETE_FAILURE:
        //     userId = action.userId
        //     return {...state, [userId]: {
        //             message: "Error attempting to delete user",
        //             type: "danger"
        //         }
        //     }
        //
        // case CLEAR_TAGS_ENTRY_NOTIFICATION:
        //     userId = action.userId
        //     let newState = { ...state }
        //     delete newState[userId]
        //     return newState

        default:
            return state
    }
}


const songTags = combineReducers({
    entries,
    notifications,
})

export default songTags
