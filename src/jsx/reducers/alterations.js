import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import { Status } from './alterationsStatus'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE,
    ALTERATION_CLEAR, ALTERATION_VALIDATION_ERROR } from 'actions/alterations'

/**
 * alteration content
 *   status: status of the alteration request
 *   message: global message relative to the current alteration request
 *   fields: error messages associated to fields
 */

export const alterationPropType = PropTypes.shape({
    status: PropTypes.symbol,
    message: PropTypes.string,
    fields: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.string
        )
    ),
})

function alteration(state, action) {
    switch (action.type) {
        case ALTERATION_REQUEST:
            return {
                status: Status.pending,
                fields: {}
            }

        case ALTERATION_SUCCESS:
            return {
                status: Status.successful,
                fields: {}
            }

        case ALTERATION_FAILURE:
        case ALTERATION_VALIDATION_ERROR:
            const { message, non_field_errors, detail } = action.error

            // fetch API error
            if (message) {
                return {
                    status: Status.failed,
                    message,
                    fields: {}
                }
            }

            // DRF global error
            if (detail) {
                return {
                    status: Status.failed,
                    message: detail,
                    fields: {}
                }
            }

            // DRF global form error or validation error
            let globalMessage
            if (non_field_errors) {
                globalMessage = non_field_errors.join(" ")
            }

            // DRF field error or field validation errors
            delete action.error.non_field_errors
            const fields = action.error

            // if no error have been caught
            if (!globalMessage && Object.keys(fields).length === 0) {
                return {
                    status: Status.failed,
                    fields: {}
                }
            }

            return {
                status: Status.failed,
                message: globalMessage,
                fields
            }

        case ALTERATION_CLEAR:
            return undefined

        default:
            return state
    }
}

function unique(state = {}, action) {
    const { alterationName, elementId } = action

    // treat alterations of type unique only
    if (typeof alterationName !== 'undefined' &&
        typeof elementId === 'undefined') {
        return {
            ...state,
            [alterationName]: alteration(state[alterationName], action)
        }
    }

    return state
}

function multiple(state = {}, action) {
    const { alterationName, elementId } = action

    // treat alterations of type multiple only
    if (typeof alterationName !== 'undefined' &&
        typeof elementId !== 'undefined') {
        const elements = state[alterationName] || {}
        return {
            ...state,
            [alterationName]: {
                ...elements,
                [elementId]: alteration(elements[elementId], action)
            }
        }
    }

    return state
}

const alterations = combineReducers({
    unique,
    multiple,
})

export default alterations
