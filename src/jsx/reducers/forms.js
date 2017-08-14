import { FORM_REQUEST, FORM_SUCCESS, FORM_FAILURE, FORM_CLEAR } from '../actions'

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
        case FORM_CLEAR:
            return null

        case FORM_SUCCESS:
            const { successMessage } = action
            if (successMessage === null) {
                return null
            }

            return {
                message: successMessage || "Success",
                type: "success"
            }

        case FORM_FAILURE:
            const { message, non_field_errors } = action.error
            // fetch API error
            if (message) {
                return {
                    message: message,
                    type: "danger"
                }
            }

            // DRF globar error
            if (non_field_errors) {
                return {
                    message: non_field_errors.join(" "),
                    type: "danger"
                }
            }

            return {
                message: "Unknow error",
                type: "danger"
            }

        default:
            return state
    }
}
