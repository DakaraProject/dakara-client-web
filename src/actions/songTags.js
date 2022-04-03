import {
    ALTERATION_FAILURE,
    ALTERATION_REQUEST,
    ALTERATION_SUCCESS
} from 'actions/alterations'
import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

/**
 * Get tag list
 */

export const TAG_LIST_REQUEST = 'TAG_LIST_REQUEST'
export const TAG_LIST_SUCCESS = 'TAG_LIST_SUCCESS'
export const TAG_LIST_FAILURE = 'TAG_LIST_FAILURE'

/**
 * Request to retrieve song tag list
 * @param page page to display
 */
export const getSongTagList = (page = 1) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/library/song-tags/?page=${page}`,
            method: 'GET',
            types: [TAG_LIST_REQUEST, TAG_LIST_SUCCESS, TAG_LIST_FAILURE],
        }
})

/**
 * Edit song tag
 */

/**
 * Request to update song tag
 * @param disabled
 */
export const editSongTag = (tagId, disabled) => ({
    [FETCH_API]: {
        endpoint: `${baseUrl}/library/song-tags/${tagId}/`,
        method: 'PATCH',
        json: {disabled},
        types: [ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE],
    },
    alterationName: 'editSongTag',
    elementId: tagId,
})
