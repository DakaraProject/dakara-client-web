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
    data: {
        current: 1,
        last: 1,
        count: 0,
        results: []
    },
    type: '',
    isFetching: false,
    fetchError: false
}

function entries(state = defaultLibraryEntries, action) {
    switch (action.type) {
        case LIBRARY_REQUEST:
            return {
                ...state,
                isFetching: true,
                fetchError: false
            }

        case LIBRARY_SUCCESS:
            return {
                data: action.response,
                type: action.libraryType,
                isFetching: false,
                fetchError: false
            }

        case LIBRARY_FAILURE:
            return {
                data: defaultLibraryEntries.data,
                type: action.libraryType,
                isFetching: false,
                fetchError: true
            }

        default:
            return state
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
        return action.response;
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
