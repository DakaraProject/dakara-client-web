import { combineReducers } from 'redux'

import alterationsResponse from 'reducers/alterationsResponse'
import authenticatedUser from 'reducers/authenticatedUser'
import internal from 'reducers/internal'
import library from 'reducers/library'
import playlist from 'reducers/playlist'
import settings from 'reducers/settings'
import token from 'reducers/token'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    playlist,
    settings,
    internal,
    authenticatedUser,
    alterationsResponse,
})

export default rootReducer
