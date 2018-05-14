import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

/**
 * Alterations actions
 *
 * The action to modify data on the server, whether with a form or directly through
 * the fetch API, is called an alteration. The response of the the server for a
 * given alteration is called an alteration response (or simply response).
 *
 * The `alteration` action is identified by its `alterationId`. If the alteration
 * is unique, i.e. unique of its kind and cannot be applied identically to another
 * element (like login or logout), the key `alterationId` alone is enough to
 * identify it.
 *
 * If the alteration is multiple, i.e. can be applied identically to another
 * element (e.g. alterations of the elements of a listing, like adding a song to
 * the playlist), the key `alterationId` and the subkey `elementId` are both
 * necessary to identify it.
 */

export const ALTERATION_REQUEST = 'ALTERATION_REQUEST'
export const ALTERATION_SUCCESS = 'ALTERATION_SUCCESS'
export const ALTERATION_FAILURE = 'ALTERATION_FAILURE'
export const ALTERATION_RESPONSE_CLEAR = 'ALTERATION_RESPONSE_CLEAR'
export const ALTERATION_VALIDATION_ERROR = 'ALTERATION_VALIDATION_ERROR'

/**
 * Generic alteration submission
 * @param alterationName key of the alteration
 * @param elementID subkey of the alteration
 * @return action
 */
export const submitAlteration = (alterationName, elementId,
    endpoint, method, json) => {
    return {
        [FETCH_API]: {
                endpoint: baseUrl + endpoint,
                method,
                json,
                types: [
                    ALTERATION_REQUEST,
                    ALTERATION_SUCCESS,
                    ALTERATION_FAILURE,
                ],
            },
        alterationName,
        elementId,
    }
}

/**
 * Clear alteration response
 * @param alterationName key of the alteration
 * @param elementID subkey of the alteration
 * @return action
 */
export const clearAlteration = (alterationName, elementId) => ({
    type: ALTERATION_RESPONSE_CLEAR,
    alterationName,
    elementId,
})

/**
 * Set validation errors in the response of the alteration
 * @param alterationName key of the alteration
 * @param elementID subkey of the alteration
 * @param global global validation error message
 * @param fields field level errors for each field
 * @return action
 */
export const setAlterationValidationErrors = (alterationName, elementId,
    global, fields) => ({
    type: ALTERATION_VALIDATION_ERROR,
    error: {
        non_field_errors: global,
        ...fields
    },
    alterationName,
    elementId,
})
