import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { combineReducers } from 'redux'

import {
    PLAYLIST_DIGEST_FAILURE,
    PLAYLIST_DIGEST_REQUEST,
    PLAYLIST_DIGEST_SUCCESS,
} from 'actions/playlistDigest'
import { Status } from 'reducers/alterationsResponse'
import {
    playerErrorPropType,
    playlistEntryPropType,
} from 'serverPropTypes/playlist'

/**
 * This reducer contains playlist digest data related state
 */

/**
 * Playlist of all entries on server
 * Minimal information is stored
 */

export const playlistEntriesStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        dateEnd: PropTypes.string.isRequired,
        playlistEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
    }).isRequired,
})

const defaultEntries = {
    status: null,
    data: {
        dateEnd: '',
        playlistEntries: []
    },
}

function entries(state = defaultEntries, action) {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending,
            }

        case PLAYLIST_DIGEST_SUCCESS:
            // if the kara status is set to stop, reset entries
            if (!action.response.karaoke.ongoing) {
                return defaultEntries
            }

            const entries = action.response.playlist_entries

            let date = dayjs()
            if (action.response.player_status.playlist_entry) {
                date = date.add(
                    // eslint-disable-next-line max-len
                    action.response.player_status.playlist_entry.song.duration - action.response.player_status.timing,
                    's'
                )
            }

            entries.forEach(e => {
                // eliminate played and current entries
                if (e.was_played || e.date_play) return

                // estimate when the entry will play
                e.date_play = date.toISOString()
                date = date.add(e.song.duration, 's')

                // mark the entry as will play
                e.will_play = true
            })

            return {
                status: Status.successful,
                data: {
                    dateEnd: date.toISOString(),
                    playlistEntries: entries,
                }
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        // // when the player has finished to play an entry, add it to the played
        // // entries
        // case PLAYLIST_PLAYED_ADD:
        //     return {
        //         ...state,
        //         data: {
        //             ...state.data,
        //             playlistPlayedEntries: [
        //                 ...state.data.playlistPlayedEntries,
        //                 action.entry
        //             ]
        //         }
        //     }

        default:
            return state
    }
}


/**
 * Player errors reported from device
 */

export const playerErrorsDigestStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.arrayOf(playerErrorPropType).isRequired,
})

const defaultPlayerErrors = {
    status: null,
    data: []
}

function playerErrors(state = defaultPlayerErrors, action) {
    switch (action.type) {
        case PLAYLIST_DIGEST_REQUEST:
            return {
                ...state,
                status: state.status || Status.pending
            }

        case PLAYLIST_DIGEST_SUCCESS:
            return {
                status: Status.successful,
                data: action.response.player_errors,
            }

        case PLAYLIST_DIGEST_FAILURE:
            return {
                ...state,
                status: Status.failed,
            }

        default:
            return state
    }
}

const digest = combineReducers({
    entries,
    playerErrors,
})

export default digest
