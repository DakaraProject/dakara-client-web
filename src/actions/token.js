import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

import {
    ALTERATION_FAILURE,
    ALTERATION_REQUEST,
    ALTERATION_SUCCESS
} from './alterations'

const { baseUrl } = params

/**
 * Token
 */

export const SET_TOKEN = 'SET_TOKEN'

export const setToken = (token) => ({
    type: SET_TOKEN,
    token
})

/**
 * Logout
 */

export const LOGOUT = 'LOGOUT'

/**
 * Logout user by deleting the token
 */
export const logout = () => ({
    type: LOGOUT
})


/**
 * Revoke token
 */

/**
 * Revoke token, causing current user to be logged out
 */
export const revokeToken = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/accounts/logout/`,
            method: 'POST',
            json: {revoke_token: true},
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE
            ],
            onSuccess: logout(),

    },
    alterationName: 'revokeToken'
})
