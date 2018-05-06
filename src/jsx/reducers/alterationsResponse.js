import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE,
    ALTERATION_RESPONSE_CLEAR, ALTERATION_VALIDATION_ERROR } from 'actions/alterations'

/**
 * Alterations response state
 *
 * The `alterationsResponse` state stores the response of the alterations. The
 * response consists in a status which defines the outcome of the alteration. If
 * the alteration has failed, the response contains one global error message and
 * several fields error messages which should explain the cause of the failure.
 *
 * The `alterationResponse` is identified by its `alterationId`. If the
 * alteration is unique, i.e. unique of its kind and cannot be applied identically
 * to another element (like login or logout), the response is stored in
 * `state.alterationsResponse.unique[alterationId]`. The key `alterationId` alone
 * is enough to recover it.
 *
 * If the alteration is multiple, i.e. can be applied identically to another
 * element (e.g. alterations of the elements of a listing, like adding a song to
 * the playlist), the response is stored in
 * `state.alterationsResponse.multiple[alterationId][elementId]`. The key
 * `alterationId` and the subkey `elementId` are both necessary to recover it. The
 * storage point `state.alterationsResponse.multiple[alterationId]` represents
 * multiple responses.
 *
 * Note that the presence of the `elementId` key within an action is the only way
 * for the reducer to distinguish a unique response from multiple ones.
 *
 * An unique response should be connected to the props of a component with the
 * prefix `responseOf` and the name of the alteration, which should start with a
 * verb (e.g. `responseOfLogout`).
 *
 * Multiple responses should be connected to the props with the prefix
 * `responseOfMultiple` and the name of the alteration (e.g.
 * `responseOfMultipleRemoveEntry`). A response among the multiple responses should
 * be connected like an unique response.
 */

/**
 * status of an alteration response
 */

export const Status = Object.freeze({
    pending: Symbol('pending'),
    successful: Symbol('successful'),
    failed: Symbol('failed')
})

/**
 * alteration response content
 *   status: status of the outcome of the alteration request
 *   message: global message relative to the current alteration request
 *   fields: error messages associated to fields
 */

export const alterationResponsePropType = PropTypes.shape({
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

        case ALTERATION_RESPONSE_CLEAR:
            return undefined

        default:
            return state
    }
}

function unique(state = {}, action) {
    const { alterationName, elementId } = action

    // treat alterations response of type unique only
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

    // treat alterations response of type multiple only
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

const alterationsResponse = combineReducers({
    unique,
    multiple,
})

export default alterationsResponse
