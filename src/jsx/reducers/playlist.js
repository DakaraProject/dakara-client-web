import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from 'actions/player'
import { PLAYLIST_PLAYED_REQUEST, PLAYLIST_PLAYED_SUCCESS, PLAYLIST_PLAYED_FAILURE } from 'actions/player'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

/**
 * This reducer contains playlist related state
 */

/**
 * Playlist from server
 */

export const playlistEntriesPropType = PropTypes.shape({
    data: PropTypes.shape({
        count: PropTypes.number.isRequired,
        results: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
})

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

function playedEntries(state = defaultEntries, action) {
    switch (action.type) {
        case PLAYLIST_PLAYED_REQUEST:
            return { ...state, isFetching: true }

        case PLAYLIST_PLAYED_SUCCESS:
            return { data: action.response, isFetching: false }

        case PLAYLIST_PLAYED_FAILURE:
            return { ...state, isFetching: false }

        default:
            return state
    }
}

/**
 * Playlist
 */

const playlist = combineReducers({
    entries,
    playedEntries,
})

export default playlist
