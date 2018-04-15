import PropTypes from 'prop-types'
import { FORM_SUCCESS } from 'actions/forms'
import { TAG_LIST_REQUEST, TAG_LIST_SUCCESS, TAG_LIST_FAILURE } from 'actions/songTags'
import { ALTERATION_FAILURE, ALTERATION_REQUEST } from 'actions/alterationsStatus'
import { songTagPropType } from 'serverPropTypes/library'
import { Status } from './alterationsStatus'
import { updateData } from 'utils'

/**
 * List of tags
 */

/**
 * Helper to update tag
 */

function updateTagInState(tagId, state, valueDict) {
    const songTags = state.data.songTags.slice()
    const index = songTags.findIndex(e => (e.id == tagId))
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
    const { json } = action
    let disabled
    if (json) {
        disabled = json.disabled
    }

    let tagId

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
