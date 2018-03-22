import PropTypes from 'prop-types'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from 'actions/player'
import { PLAYLIST_TOOGLE_COLLAPSED } from 'actions/player'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { Status } from './alterationsStatus'
import { updateData } from 'utils'

/**
 * This reducer contains playlist related state
 */

/**
 * Playlist from server
 */

export const playlistPropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        count: PropTypes.number.isRequired,
        playlistEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    }).isRequired,
})

const defaultPlaylist = {
    status: null,
    data: {
        count: 0,
        playlistEntries: []
    },
}

export function playlist(state = defaultPlaylist, action) {
    switch (action.type) {
        case PLAYLIST_REQUEST:
            return {
                ...state,
                status: Status.pending,
            }

        case PLAYLIST_SUCCESS:
            return {
                status: Status.successful,
                data: updateData(action.response, 'playlistEntries'),
            }

        case PLAYLIST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        default:
            return state
    }
}

/**
 * Playlist collapsed status
 */

export function collapsedPlaylist(state = true, action) {
    if (action.type === PLAYLIST_TOOGLE_COLLAPSED) {
        return !state
    }

    return state
}
