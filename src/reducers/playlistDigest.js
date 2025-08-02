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
import { differentiateEntries } from 'utils'

/**
 * This reducer contains playlist digest data related state
 */

/**
 * Playlist of all entries on server
 * Minimal information is stored
 */

export const playlistEntriesDigestStateDataPropType = PropTypes.shape({
  dateEnd: PropTypes.string.isRequired,
  playedEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
  playingEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
  queuingEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
})

export const playlistEntriesDigestStatePropType = PropTypes.shape({
  status: PropTypes.symbol,
  data: playlistEntriesDigestStateDataPropType.isRequired,
})

const defaultEntries = {
  status: null,
  data: {
    dateEnd: '',
    playedEntries: [],
    playingEntries: [],
    queuingEntries: [],
  },
}

function entries(state = defaultEntries, action) {
  switch (action.type) {
    case PLAYLIST_DIGEST_REQUEST:
      return {
        ...state,
        status: state.status || Status.pending,
      }

    case PLAYLIST_DIGEST_SUCCESS: {
      // if the kara status is set to stop, reset entries
      if (!action.response.karaoke.ongoing) {
        return defaultEntries
      }

      const entries = action.response.playlist_entries

      // update current date to when the playing playlist entry ends
      let date = dayjs()
      if (action.response.player_status.playlist_entry) {
        date = date.add(
          action.response.player_status.playlist_entry.song.duration -
            action.response.player_status.timing,
          's'
        )
      }

      // differentiate playlist entries
      const [playedEntries, playingEntries, queuingEntries] =
        differentiateEntries(entries)

      // update queuing entries with estimated date of play
      queuingEntries.forEach((e) => {
        e.date_play = date.toISOString()
        date = date.add(e.song.duration, 's')
      })

      return {
        status: Status.successful,
        data: {
          dateEnd: date.toISOString(),
          playedEntries,
          playingEntries,
          queuingEntries,
        },
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
  data: PropTypes.shape({
    playerErrors: PropTypes.arrayOf(playerErrorPropType).isRequired,
  }),
})

const defaultPlayerErrors = {
  status: null,
  data: {
    playerErrors: [],
  },
}

function playerErrors(state = defaultPlayerErrors, action) {
  switch (action.type) {
    case PLAYLIST_DIGEST_REQUEST:
      return {
        ...state,
        status: state.status || Status.pending,
      }

    case PLAYLIST_DIGEST_SUCCESS:
      return {
        status: Status.successful,
        data: {
          playerErrors: action.response.player_errors,
        },
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
