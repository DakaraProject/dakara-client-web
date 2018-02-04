import { combineReducers } from 'redux'
import { FORM_SUCCESS } from 'actions'
import { TAG_LIST_REQUEST, TAG_LIST_SUCCESS, TAG_LIST_FAILURE } from 'actions'
import { ALTERATION_FAILURE, ALTERATION_REQUEST } from 'actions'

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

        case ALTERATION_FAILURE:
            disabled = !disabled

        case ALTERATION_REQUEST:
            if (action.alterationName != 'editSongTag') {
                return state
            }

            // Update disabled status of updated tag
            tagId = action.elementId
            return updateTagInState(tagId, state, {disabled})

        case FORM_SUCCESS:
            const tagColorFormPrefix = "tagColorEdit"
            if (!action.formName.startsWith(tagColorFormPrefix)) return state

            // Update new color of updated tag
            tagId = action.formName.split(tagColorFormPrefix)[1]
            const { color_hue } = json
            return updateTagInState(tagId, state, {color_hue})

        default:
            return state
    }
}

const songTags = combineReducers({
    entries,
})

export default songTags
