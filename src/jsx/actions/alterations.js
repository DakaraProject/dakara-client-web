import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

/**
 * alterations
 */

export const ALTERATION_REQUEST = 'ALTERATION_REQUEST'
export const ALTERATION_SUCCESS = 'ALTERATION_SUCCESS'
export const ALTERATION_FAILURE = 'ALTERATION_FAILURE'
export const ALTERATION_CLEAR = 'ALTERATION_CLEAR'
export const ALTERATION_VALIDATION_ERROR = 'ALTERATION_VALIDATION_ERROR'

/**
 * Generic alteration submit
 * @param 
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

/** Clear alteration notifications and errors
 * @param alterationName name of the alteration
 */
export const clearAlteration = (alterationName, elementId) => ({
    type: ALTERATION_CLEAR,
    alterationName,
    elementId,
})

/** Set validation errors on a alteration 
 * @param alterationName name of the alteration
 * @param global global validation error message
 * @param fields field level errors for each field
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
