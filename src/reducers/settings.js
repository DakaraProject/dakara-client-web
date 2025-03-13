import { combineReducers } from 'redux'

import songTags from 'reducers/songTags'
import users from 'reducers/users'

export default combineReducers({
  users,
  songTags,
})
