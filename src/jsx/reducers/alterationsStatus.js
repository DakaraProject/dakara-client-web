import PropTypes from 'prop-types'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE,
    ALTERATION_CLEAR } from 'actions/alterationsStatus'

export const Status = Object.freeze({
    pending: Symbol('pending'),
    successful: Symbol('successful'),
    failed: Symbol('failed')
})

/**
 * Alterations status contains an object of alteration status items
 */

export default function alterationsStatus(state = {}, action) {
    const { alterationName, elementId } = action

    if (alterationName) {
        const elements = state[alterationName] || {}
        return {
            ...state,
            [alterationName]: {
                ...elements,
                [elementId]: alterationStatus(elements[elementId], action)
            }
        }
    }

    return state
}

/**
 * Alteration status content:
 *   status: status of the alteration
 *   message: external message relative to the current status
 */

export const alterationStatusPropType = PropTypes.shape({
    status: PropTypes.symbol,
    message: PropTypes.string,
})

function alterationStatus(state, action) {
    switch (action.type) {
        case ALTERATION_REQUEST:
            return {
                status: Status.pending
            }

        case ALTERATION_FAILURE:
            return {
                status: Status.failed,
                message: handleFailureMessage(action),
            }

        case ALTERATION_SUCCESS:
            return {
                status: Status.successful,
            }

        case ALTERATION_CLEAR:
            return undefined

        default:
            return state
    }
}

export function handleFailureMessage(action) {
    const { message, non_field_errors, detail } = action.error
    // fetch API error
    if (message) {
        return message
    }

    // DRF global error
    if (detail) {
        return detail
    }

    // DRF global form error or validation error
    if (non_field_errors) {
        return non_field_errors.join(" ")
    }

    return null

    // TODO handle fields error when needed
}
