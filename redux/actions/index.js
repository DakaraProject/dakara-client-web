import { CALL_API } from 'redux-api-middleware';

/**
 * Get a page of songs
 */

export const SONGS_REQUEST = 'SONGS_REQUEST'
export const SONGS_SUCCESS = 'SONGS_SUCCESS'
export const SONGS_FAILURE = 'SONGS_FAILURE'

const fetchSongs = (pageNumber, token) => ({
  [CALL_API]: {
      endpoint: `/library/songs/?page=${pageNumber}`,
      method: 'GET',
      headers: {Authorization: 'Token ' + token},
      types: [SONGS_REQUEST, SONGS_SUCCESS, SONGS_FAILURE]
    }
})

/**
 * Load a page of songs from server
 * @param pageNumber page to load
 */
export const loadSongs = (pageNumber = 1) => (dispatch, getState) => {
    const state = getState()
    if(pageNumber == state.libraryEntries.current) {
        return null
    }

    // check token exists
    const token = state.token
    if (!token) {
        return null
    }

    return dispatch(fetchSongs(pageNumber, token))
}


/**
 * Login
 */

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

const sendLoginRequest = (username, password) => ({
  [CALL_API]: {
      endpoint: '/api-token-auth/',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
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
