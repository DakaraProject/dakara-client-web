import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import player from './player'
import authenticatedUser from './authenticatedUser'
import forms from './forms'
import alterationsStatus from './alterationsStatus'
import settings from './settings'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    player,
    settings,
    authenticatedUser,
    forms,
    alterationsStatus,
})

export default rootReducer
