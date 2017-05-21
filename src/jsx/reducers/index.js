import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import loginPage from './loginPage'
import player from './player'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    loginPage,
    player
})

export default rootReducer
