import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import loginPage from './loginPage'
import player from './player'
import users from './users'
import userPage from './userPage'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    loginPage,
    player,
    users,
    userPage
})

export default rootReducer
