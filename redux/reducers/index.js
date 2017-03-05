import { SONGS_REQUEST, SONGS_SUCCESS, SONGS_FAILURE } from '../actions'
import { combineReducers } from 'redux'

const defaultLibraryEntries =  {
        current: 0,
        last: 0,
        count: 0,
        results: [],
}       


function libraryEntries(state = defaultLibraryEntries, action) {
    if (action.type === SONGS_SUCCESS) {
        return action.payload;
    } else {
        return state;
    }
}

const rootReducer = combineReducers({
    libraryEntries
})


export default rootReducer
