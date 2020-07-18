import { combineReducers } from 'redux'
import songTags from './songTags'
import users from './users'

export default combineReducers({
    users,
    songTags,
})
