import { combineReducers } from 'redux'
import { TAG_LIST_REQUEST, TAG_LIST_SUCCESS, TAG_LIST_FAILURE } from '../actions'
import { EDIT_SONG_TAG_REQUEST, EDIT_SONG_TAG_SUCCESS, EDIT_SONG_TAG_FAILURE } from '../actions'
import { CLEAR_TAG_LIST_ENTRY_NOTIFICATION } from '../actions'

const defaultEntries = {
    data: {
        count: 0,
        results: []
    },
    isFetching: false
}

/**
 * List of tags
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
 * Tag edit error message
 */

function notifications(state = {}, action) {
    let tagId
    switch (action.type) {
        case EDIT_SONG_TAG_FAILURE:
            tagId = action.tagId
            return {...state, [tagId]: {
                    message: "Error attempting to edit tag",
                    type: "danger"
                }
            }
        case CLEAR_TAG_LIST_ENTRY_NOTIFICATION:
            tagId = action.tagId
            let newState = { ...state }
            delete newState[tagId]
            return newState

        default:
            return state
    }
}


const songTags = combineReducers({
    entries,
    notifications,
})

export default songTags
