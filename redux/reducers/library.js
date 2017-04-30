import { combineReducers } from 'redux'
import { LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE } from '../actions'
import { ADDPLAYLIST_REQUEST, ADDPLAYLIST_SUCCESS, ADDPLAYLIST_FAILURE } from '../actions'
import { WORKTYPES_REQUEST, WORKTYPES_SUCCESS, WORKTYPES_FAILURE } from '../actions'
import { CLEAR_SONG_LIST_NOTIFICATION } from '../actions'

/**
 * This reducer contains library related state
 */


/**
 * Current content of the library
 */

const defaultLibraryEntries =  {
        current: 0,
        last: 0,
        count: 0,
        results: [],
        type: ''
}

function entries(state = defaultLibraryEntries, action) {
    if (action.type === LIBRARY_SUCCESS) {
        return {...action.payload, type:action.libraryType};
    } else {
        return state;
    }
}

/**
 * Work Types
 */

const defaultWorkTypes =  {
        results: []
}

function workTypes(state = defaultWorkTypes, action) {
    if (action.type === WORKTYPES_SUCCESS) {
        return action.payload;
    } else {
        return state;
    }
}

/**
 * Add song to playlist message
 */

function songListNotifications(state = {}, action) {
    let songId
    switch (action.type) {
        case ADDPLAYLIST_REQUEST:
            songId = action.songId
            return {...state, [songId]: {
                    message: "Adding...",
                    type: "success"
                }
            }

        case ADDPLAYLIST_SUCCESS:
            songId = action.songId
            return {...state, [songId]: {
                    message: "Successfuly added!",
                    type: "success"
                }
            }

        case ADDPLAYLIST_FAILURE:
            songId = action.songId
            return {...state, [songId]: {
                    message: "Error attempting to add song to playlist",
                    type: "danger"
                }
            }

        case CLEAR_SONG_LIST_NOTIFICATION:
            songId = action.songId
            let newState = { ...state }
            delete newState[songId]
            return newState

        default:
            return state
    }
}

const library = combineReducers({
    entries,
    workTypes,
    songListNotifications
})

export default library
