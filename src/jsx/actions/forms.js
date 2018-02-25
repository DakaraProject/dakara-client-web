import { FETCH_API } from 'middleware/fetchApi'
import utils from 'utils'

const { baseUrl } = utils.params

/**
 * Forms
 */

export const FORM_REQUEST = 'FORM_REQUEST'
export const FORM_SUCCESS = 'FORM_SUCCESS'
export const FORM_FAILURE = 'FORM_FAILURE'
export const FORM_CLEAR = 'FORM_CLEAR'
export const FORM_SET_VALIDATION_ERRORS = 'FORM_SET_VALIDATION_ERRORS'

/**
 * Generic form submit
 * @param 
 */
export const submitForm = (formName, endpoint, method, json) => {
    return {
        [FETCH_API]: {
                endpoint: baseUrl + endpoint,
                method,
                json,
                types: [
                    FORM_REQUEST,
                    FORM_SUCCESS,
                    FORM_FAILURE,
                ],
            },
        formName,
    }
}

/** Clear form notifications and errors
 * @param formName name of the form
 */
export const clearForm = (formName) => ({
    type: FORM_CLEAR,
    formName
})

/** Set validation errors on a form 
 * @param formName name of the form
 * @param global global validation error message
 * @param fields field level errors for each field
 */
export const setFormValidationErrors = (formName, global, fields) => ({
    type: FORM_SET_VALIDATION_ERRORS,
    formName,
    error: {
        non_field_errors: global,
        ...fields
    }
})
