import { combineReducers } from 'redux'

import {
  USER_CLEAR,
  USER_GET_FAILURE,
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_LIST_FAILURE,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
} from 'actions/users'
import { Status } from 'reducers/alterationsResponse'
import { updateData } from 'utils'

/**
 * List of users
 */

const defaultList = {
  status: null,
  data: {
    pagination: {
      current: 1,
      last: 1,
    },
    count: 0,
    users: [],
  },
}

function list(state = defaultList, action) {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return {
        ...state,
        status: Status.pending,
      }

    case USER_LIST_SUCCESS:
      return {
        data: updateData(action.response, 'users'),
        status: Status.successful,
      }

    case USER_LIST_FAILURE:
      return {
        ...state,
        status: Status.failed,
      }

    default:
      return state
  }
}

/**
 * Edit one user
 */

const defaultEdit = {
  status: null,
  data: {
    user: null,
  },
}

function edit(state = defaultEdit, action) {
  switch (action.type) {
    case USER_GET_REQUEST:
      return {
        ...state,
        status: Status.pending,
      }

    case USER_GET_SUCCESS:
      return {
        status: Status.successful,
        data: {
          user: action.response,
        },
      }

    case USER_GET_FAILURE:
      return {
        ...state,
        status: Status.failed,
      }

    case USER_CLEAR:
      return defaultEdit

    default:
      return state
  }
}

export default combineReducers({
  list,
  edit,
})
