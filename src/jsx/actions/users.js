import { FETCH_API } from 'middleware/fetchApi'
import { ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE, ALTERATION_CLEAR } from './alterationsStatus'
import { params } from 'utils'

const { baseUrl } = params

const delay = (action, delay) => ({
    ...action,
    delay
})

/**
 * Get user list
 */

export const USER_LIST_REQUEST = "USER_LIST_REQUEST"
export const USER_LIST_SUCCESS = "USER_LIST_SUCCESS"
export const USER_LIST_FAILURE = "USER_LIST_FAILURE"

/**
 * Action creator to refresh users in the current page
 */
const refreshUsers = (dispatch, getState) => {
    const page = getState().settings.users.entries.data.current
    return dispatch(getUsers(page))
}

const refreshUsersDelayed = (dispatch, getState) => {
    const page = getState().settings.users.entries.data.current
    return dispatch(delay(getUsers(page), 3000))
}

/**
 * Request to retrieve user list
 * @param page page to display
 */
export const getUsers = (page = 1) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/?page=${page}`,
            method: 'GET',
            types: [USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE],
        }
})

/**
 * Delete user
 */

/**
 * Request to delete one user
 * @param userId ID of user to delete
 */
export const deleteUser = (userId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/${userId}/`,
            method: 'DELETE',
            types: [
                ALTERATION_REQUEST,
                ALTERATION_SUCCESS,
                ALTERATION_FAILURE,
            ],
            onSuccess: [
                refreshUsersDelayed,
            ],
        },
    alterationName: "deleteUser",
    elementId: userId
})

/**
 * Clear users entry notification
 */

/**
 * Clear one nofitication
 * @param userId line to clear
 */
export const clearUsersEntryNotification = (userId) => ({
    type: ALTERATION_CLEAR,
    alterationName: "deleteUser",
    elementId: userId
})

/**
 * Get one user
 */

export const USER_GET_REQUEST = "USER_GET_REQUEST"
export const USER_GET_SUCCESS = "USER_GET_SUCCESS"
export const USER_GET_FAILURE = "USER_GET_FAILURE"
export const USER_CLEAR = "USER_CLEAR"


/**
 * Fetch a user
 * @param userId ID of user to get
 */
export const getUser = (userId) => ({
    [FETCH_API]: {
            endpoint: `${baseUrl}users/${userId}/`,
            method: 'GET',
            types: [USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE],
        },
})

export const clearUser = () => ({
    type: USER_CLEAR
})
