import { CALL_API } from 'redux-api-middleware'

/**
 * Get a page of libraryEntries
 */

export const LIBRARY_REQUEST = 'LIBRARY_REQUEST'
export const LIBRARY_SUCCESS = 'LIBRARY_SUCCESS'
export const LIBRARY_FAILURE = 'LIBRARY_FAILURE'

const fetchLibraryEntries = (url) => ({
    [CALL_API]: {
            endpoint: url,
            method: 'GET',
            types: [LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE]
        }
})

/**
 * Load a page of songs from server
 * @param pageNumber page to load
 */
export const loadLibraryEntries = (libraryType = "songs", workType, pageNumber = 1) => (dispatch, getState) => {
/*    const state = getState()
    if(pageNumber == state.libraryEntries.current) {
        return null
    }*/

    let url = `/api/library/${libraryType}/?page=${pageNumber}`
    if (workType) {
        url += `&type=${workType}`
    }
    return dispatch(fetchLibraryEntries(url))
}


/**
 * Login
 */

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

const sendLoginRequest = (username, password) => ({
    [CALL_API]: {
            endpoint: '/api/token-auth/',
            method: 'POST',
            json: {username, password},
            types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE]
        }
})

/**
 * Login user to the server
 * @param username username
 * @param password password
 */
export const login = (username, password) => (dispatch) => {
    return dispatch(sendLoginRequest(username, password))
}


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
