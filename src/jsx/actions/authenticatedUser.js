import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

/**
 * Get logged in user info 
 */

export const CURRENT_USER_REQUEST = 'CURRENT_USER_REQUEST'
export const CURRENT_USER_SUCCESS = 'CURRENT_USER_SUCCESS'
export const CURRENT_USER_FAILURE = 'CURRENT_USER_FAILURE'

/**
 * Request current user info 
 */
export const loadCurrentUser = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/current/`,
            method: 'GET',
            types: [CURRENT_USER_REQUEST, CURRENT_USER_SUCCESS, CURRENT_USER_FAILURE],
        }
})
