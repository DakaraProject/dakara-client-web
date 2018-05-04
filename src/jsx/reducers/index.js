import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import playlist from './playlist'
import authenticatedUser from './authenticatedUser'
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
    alterations,
})

export default rootReducer
