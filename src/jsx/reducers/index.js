import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import playlist from './playlist'
import authenticatedUser from './authenticatedUser'
import forms from './forms'
import alterationsStatus from './alterationsStatus'
import alterations from './alterations'
import settings from './settings'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    playlist,
    settings,
    authenticatedUser,
    forms,
    alterationsStatus,
    alterations,
})

export default rootReducer
