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

