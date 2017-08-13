import { combineReducers } from 'redux'
import { UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, UPDATE_PASSWORD_FAILURE } from '../actions'

/**
 * This reducer contains user Page state
 */

/**
 * User Page message
 */

function message(state = null, action) {
    switch (action.type) {
        case UPDATE_PASSWORD_REQUEST:
            return null

        case UPDATE_PASSWORD_SUCCESS:
            return {
                message: "Update successful",
                type: "success"
            }

        case UPDATE_PASSWORD_FAILURE:
            const { message, non_field_errors } = action.error
            if (message) {
                return {
                    message: message,
                    type: "danger"
                }
            }

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

const userPage = combineReducers({
    message
})

export default userPage
