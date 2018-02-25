import { FORM_REQUEST, FORM_SUCCESS, FORM_FAILURE, FORM_CLEAR, FORM_SET_VALIDATION_ERRORS } from 'actions/forms'
import { Status } from 'reducers/alterationsStatus'

/**
 * This reducer contains forms state
 */


export default function forms(state = {}, action) {
    const { formName } = action

    if (formName) {
        return {
            ...state,
            [formName]: form(state[formName], action)
        }
    }

    return state
}

function form(state, action) {
    switch (action.type) {
        case FORM_REQUEST:
            return {
                status: Status.pending,
                fields: {}
            }

        case FORM_SUCCESS:
            return {
                status: Status.successful,
                fields: {}
            }

        case FORM_FAILURE:
        case FORM_SET_VALIDATION_ERRORS:
            const { message, non_field_errors, detail } = action.error
            // fetch API error
            // DRF global error
            if (message || detail) {
                return {
                    status: Status.failed,
                    message: message || detail,
                    fields: {}
                }
            }

            // DRF global form error or validation error
            let formGlobalMessage
            if (non_field_errors) {
                formGlobalMessage = non_field_errors.join(" ")
            }

            // DRF field error or field validation errors
            delete action.error.non_field_errors
            const fields = action.error

            // if no error have been caught
            if (!formGlobalMessage && Object.keys(fields).length === 0) {
                return {
                    status: Status.failed,
                    fields: {}
                }
            }

            return {
                status: Status.failed,
                message: formGlobalMessage,
                fields
            }

        case FORM_CLEAR:
            return undefined

        default:
            return state
    }
}
