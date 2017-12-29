import { combineReducers } from 'redux'
import { FORM_SUCCESS } from '../actions'
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

function updateTagInState(tagId, state, valueDict) {
    const results = state.data.results.slice()
    const index = results.findIndex(e => (e.id == tagId))
    results[index] = {
        ...results[index],
        ...valueDict
    }

    return {
        ...state,
        data: {
            ...state.data,
            results
        }
    }
}

function entries(state = defaultEntries, action) {
    const { json } = action
    let disabled
    if (json) {
        disabled = json.disabled
    }

    let tagId

    switch (action.type) {
        case TAG_LIST_REQUEST:
            return { ...state, isFetching: true }

        case TAG_LIST_SUCCESS:
            return { data: action.response, isFetching: false }

        case TAG_LIST_FAILURE:
            return { ...state, isFetching: false }

        case EDIT_SONG_TAG_FAILURE:
            disabled = !disabled

        case EDIT_SONG_TAG_REQUEST:
            // Update disabled status of updated tag
            tagId = action.tagId
            return updateTagInState(tagId, state, {disabled})

        case FORM_SUCCESS:
            const tagColorFormPrefix = "tagColorEdit"
            if (!action.formName.startsWith(tagColorFormPrefix)) return state

            // Update new color of updated tag
            tagId = action.formName.split(tagColorFormPrefix)[1]
            const { color_id } = json
            return updateTagInState(tagId, state, {color_id})

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
        case EDIT_SONG_TAG_REQUEST:
            tagId = action.tagId
            return {...state, [tagId]: {
                    isFetching: true
                }
            }

        case EDIT_SONG_TAG_FAILURE:
            tagId = action.tagId
            return {...state, [tagId]: {
                    message: "Error attempting to edit tag",
                    type: "danger",
                    isFetching: false
                }
            }

        case EDIT_SONG_TAG_SUCCESS:
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
