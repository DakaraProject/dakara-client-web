import { combineReducers } from 'redux'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from '../actions'
import { CLEAR_PLAYLIST_ENTRY_NOTIFICATION } from '../actions'
import { PLAYLIST_TOOGLE_COLLAPSED } from '../actions'
import { REMOVEPLAYLISTENTRY_REQUEST, REMOVEPLAYLISTENTRY_SUCCESS, REMOVEPLAYLISTENTRY_FAILURE } from '../actions'

/**
 * This reducer contains playlist related state
 */

/**
 * Playlist from server
 */

const defaultEntries = {
    data: {
        count: 0,
        results: []
    },
    isFetching: false
}

function entries(state = defaultEntries, action) {
    switch (action.type) {
        case PLAYLIST_REQUEST:
            return { ...state, isFetching: true }
        case PLAYLIST_SUCCESS:
            return { data: action.response, isFetching: false }
        case PLAYLIST_FAILURE:
            return { ...state, isFetching: false }
        default:
            return state
    }
}

/** Playlist collapsed status
 */

function collapsed(state = true, action) {
    if (action.type === PLAYLIST_TOOGLE_COLLAPSED) {
        return !state
    }

    return state
}

/**
 * Remove song from playlist message
 */

function notifications(state = {}, action) {
    let entryId
    switch (action.type) {
        case REMOVEPLAYLISTENTRY_REQUEST:
            entryId = action.entryId
            return {...state, [entryId]: {
                    message: "Removing...",
                    type: "success"
                }
            }

        case REMOVEPLAYLISTENTRY_SUCCESS:
            entryId = action.entryId
            return {...state, [entryId]: {
                    message: "Successfuly removed!",
                    type: "success"
                }
            }

        case REMOVEPLAYLISTENTRY_FAILURE:
            entryId = action.entryId
            return {...state, [entryId]: {
                    message: "Error attempting to remove song from playlist",
                    type: "danger"
                }
            }

        case CLEAR_PLAYLIST_ENTRY_NOTIFICATION:
            entryId = action.entryId
            let newState = { ...state }
            delete newState[entryId]
            return newState

        default:
            return state
    }
}

const playlist = combineReducers({
    entries,
    collapsed,
    notifications
})

export default playlist
