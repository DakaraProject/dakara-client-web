import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import player from './player'
import users from './users'
import forms from './forms'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    player,
    users,
    forms
})

export default rootReducer
