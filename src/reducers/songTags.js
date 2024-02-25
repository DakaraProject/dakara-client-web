import PropTypes from 'prop-types'

import {
    ALTERATION_FAILURE,
    ALTERATION_REQUEST,
    ALTERATION_SUCCESS
} from 'actions/alterations'
import { TAG_LIST_FAILURE, TAG_LIST_REQUEST, TAG_LIST_SUCCESS } from 'actions/songTags'
import { Status } from 'reducers/alterationsResponse'
import { songTagPropType } from 'serverPropTypes/library'
import { updateData } from 'utils'

/**
 * List of tags
 */

/**
 * Helper to update tag
 * The tag is not directly accessible by its ID (as in
 * `state.data.songTags[tagId]`), so this helper helps to access it.
 * @param tagId ID of the tag to edit
 * @param state current state
 * @pararm valueDict object of values to update
 */
function updateTagInState(tagId, state, valueDict) {
    const songTags = state.data.songTags.slice()
    const index = songTags.findIndex(e => (e.id === tagId))
    songTags[index] = {
        ...songTags[index],
        ...valueDict
    }

    return {
        ...state,
        data: {
            ...state.data,
            songTags,
        }
    }
}

/**
 * Tag entries
 */

export const songTagsStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        pagination: PropTypes.shape({
            current: PropTypes.number.isRequired,
            last: PropTypes.number.isRequired,
        }).isRequired,
        count: PropTypes.number.isRequired,
        songTags: PropTypes.arrayOf(songTagPropType).isRequired,
    }).isRequired,
})

const defaultSongTagsSettings = {
    status: null,
    data: {
        pagination: {
            current: 1,
            last: 1,
        },
        count: 0,
        songTags: []
    },
}

export default function songTags(state = defaultSongTagsSettings, action) {
    const { json, alterationName, elementId } = action
    let disabled
    if (json) {
        disabled = json.disabled
    }

    switch (action.type) {
        case TAG_LIST_REQUEST:
            return {
                ...state,
                status: Status.pending,
            }

        case TAG_LIST_SUCCESS:
            return {
                status: Status.successful,
                data: updateData(action.response, 'songTags'),
            }

        case TAG_LIST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        case ALTERATION_FAILURE:
            // If the update failed, revert the disableness and enter
            // the ALTERATION_REQUEST case
            disabled = !disabled
            // falls through

        case ALTERATION_REQUEST:
            if (alterationName !== 'editSongTag') return state

            // Update disableness of updated tag
            return updateTagInState(elementId, state, {disabled})

        case ALTERATION_SUCCESS: {
            if (alterationName !== 'editSongTagColor') return state

            // Update new color of updated tag
            const { color_hue } = json
            return updateTagInState(elementId, state, {color_hue})
        }

        default:
            return state
    }
}
