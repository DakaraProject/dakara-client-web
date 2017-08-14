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

const defaultState = {
    global: null,
    fields: {}
}

function form(state, action) {
    switch (action.type) {
        case FORM_REQUEST:
        case FORM_CLEAR:
            return defaultState

        case FORM_SUCCESS:
            const { successMessage } = action
            if (successMessage === null) {
                return defaultState
            }

            return {
                global: {
                    message: successMessage || "Success",
                    type: "success"
                },
                fields: {}
            }

        case FORM_FAILURE:
            const { message, non_field_errors, detail } = action.error
            // fetch API error
            if (message) {
                return {
                    global: {
                        message: message,
                        type: "danger"
                    },
                    fields: {}
                }
            }

            // DRF global error
            if (detail) {
                return {
                    global: {
                        message: detail,
                        type: "danger"
                    },
                    fields: {}
                }
            }


            // DRF global form error
            let global
            if (non_field_errors) {
                global = {
                    message: non_field_errors.join(" "),
                    type: "danger"
                }
            }

            // DRF field error
            delete action.error.non_field_errors
            const fields = action.error

            // if no error have been caught
            if (!global && Object.keys(fields).length === 0) {
                return {
                    global: {
                        message: "Unknow error",
                        type: "danger"
                    },
                    fields: {}
                }
            }

            return {
                global,
                fields
            }

        default:
            return state
    }
}
