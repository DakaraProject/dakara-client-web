import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import loginPage from './loginPage'
import player from './player'
import users from './users'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    loginPage,
    player,
    users
})

export default rootReducer
