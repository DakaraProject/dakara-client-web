import PropTypes from 'prop-types'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from 'actions/player'
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

export default function playlist(state = defaultPlaylist, action) {
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
