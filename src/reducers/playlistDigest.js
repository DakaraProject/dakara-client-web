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
import { differentiateEntries, getEntriesHash } from 'utils'

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
  playedEntriesHash: PropTypes.number.isRequired,
  playingEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
  playingEntriesHash: PropTypes.number.isRequired,
  queuingEntries: PropTypes.arrayOf(playlistEntryPropType).isRequired,
  queuingEntriesHash: PropTypes.number.isRequired,
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
    playedEntriesHash: 0,
    playingEntries: [],
    playingEntriesHash: 0,
    queuingEntries: [],
    queuingEntriesHash: 0,
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
      const { playedEntries, playingEntries, queuingEntries } =
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
          playedEntriesHash: getEntriesHash(playedEntries),
          playingEntries,
          playingEntriesHash: getEntriesHash(playingEntries),
          queuingEntries,
          queuingEntriesHash: getEntriesHash(queuingEntries),
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
    playerErrorsHash: PropTypes.number.isRequired,
  }),
})

const defaultPlayerErrors = {
  status: null,
  data: {
    playerErrors: [],
    playerErrorsHash: 0,
  },
}

function playerErrors(state = defaultPlayerErrors, action) {
  switch (action.type) {
    case PLAYLIST_DIGEST_REQUEST:
      return {
        ...state,
        status: state.status || Status.pending,
      }

    case PLAYLIST_DIGEST_SUCCESS: {
      const playerErrors = action.response.player_errors
      return {
        status: Status.successful,
        data: {
          playerErrors,
          playerErrorsHash: getEntriesHash(playerErrors),
        },
      }
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
