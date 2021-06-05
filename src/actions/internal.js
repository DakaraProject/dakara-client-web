import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

/**
 * Get server settings
 */

export const SERVER_SETTINGS_REQUEST = 'SERVER_SETTINGS_REQUEST'
export const SERVER_SETTINGS_SUCCESS = 'SERVER_SETTINGS_SUCCESS'
export const SERVER_SETTINGS_FAILURE = 'SERVER_SETTINGS_FAILURE'

/**
 * Request server settings
 */
export const loadServerSettings = () => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}/settings/`,
            method: 'GET',
            types: [SERVER_SETTINGS_REQUEST, SERVER_SETTINGS_SUCCESS, SERVER_SETTINGS_FAILURE],
        }
})
