import {
  ALTERATION_FAILURE,
  ALTERATION_REQUEST,
  ALTERATION_SUCCESS,
} from 'actions/alterations'
import { FETCH_API } from 'middleware/fetchApi'
import { params } from 'utils'

const { baseUrl } = params

const delay = (action, delay) => ({
  ...action,
  delay,
})

/**
 * Get user list
 */

export const USER_LIST_REQUEST = 'USER_LIST_REQUEST'
export const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS'
export const USER_LIST_FAILURE = 'USER_LIST_FAILURE'

/**
 * Action creator to refresh users in the current page
 */
const refreshUsersDelayed = (dispatch, getState) => {
  const page = getState().settings.users.list.data.pagination.current
  return dispatch(delay(getUsers(page), 3000))
}

/**
 * Request to retrieve user list
 * @param page page to display
 */
export const getUsers = (page = 1) => ({
  [FETCH_API]: {
    endpoint: `${baseUrl}/users/?page=${page}`,
    method: 'GET',
    types: [USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAILURE],
  },
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
    endpoint: `${baseUrl}/users/${userId}/`,
    method: 'DELETE',
    types: [ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE],
    onSuccess: [refreshUsersDelayed],
  },
  alterationName: 'deleteUser',
  elementId: userId,
})

/**
 * Get one user
 */

export const USER_GET_REQUEST = 'USER_GET_REQUEST'
export const USER_GET_SUCCESS = 'USER_GET_SUCCESS'
export const USER_GET_FAILURE = 'USER_GET_FAILURE'
export const USER_CLEAR = 'USER_CLEAR'

/**
 * Fetch a user
 * @param userId ID of user to get
 */
export const getUser = (userId) => ({
  [FETCH_API]: {
    endpoint: `${baseUrl}/users/${userId}/`,
    method: 'GET',
    types: [USER_GET_REQUEST, USER_GET_SUCCESS, USER_GET_FAILURE],
  },
})

export const clearUser = () => ({
  type: USER_CLEAR,
})

/**
 * Verify user registration
 * @param userId id of the user
 * @param timestamp timestamp of the validation
 * @param signature signature of the validation
 */
export const verifyRegistration = (userId, timestamp, signature) => ({
  [FETCH_API]: {
    endpoint: `${baseUrl}/accounts/verify-registration/`,
    method: 'POST',
    json: {
      user_id: userId,
      timestamp,
      signature,
    },
    types: [ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE],
  },
  alterationName: 'verifyRegistration',
})

/**
 * Verify user email
 * @param userId id of the user
 * @param email new email address
 * @param timestamp timestamp of the validation
 * @param signature signature of the validation
 */
export const verifyEmail = (userId, email, timestamp, signature) => ({
  [FETCH_API]: {
    endpoint: `${baseUrl}/accounts/verify-email/`,
    method: 'POST',
    json: {
      user_id: userId,
      email,
      timestamp,
      signature,
    },
    types: [ALTERATION_REQUEST, ALTERATION_SUCCESS, ALTERATION_FAILURE],
  },
  alterationName: 'verifyEmail',
})
