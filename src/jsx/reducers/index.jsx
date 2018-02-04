import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import player from './player'
import authenticatedUsers from './authenticatedUsers'
import users from './users'
import forms from './forms'
import alterationsStatus from './alterationsStatus'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    player,
    users,
    authenticatedUsers,
    forms,
    alterationsStatus,
})

export default rootReducer
