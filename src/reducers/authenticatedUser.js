import { CURRENT_USER_SUCCESS } from 'actions/authenticatedUser'
import { LOGOUT } from 'actions/token'

/**
 * Part of the state storing the logged in user info
 */

function authenticatedUser(state = null, action) {
  switch (action.type) {
    case CURRENT_USER_SUCCESS:
      return action.response

    case LOGOUT:
      return null

    default:
      return state
  }
}

export default authenticatedUser
