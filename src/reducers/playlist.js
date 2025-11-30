import { combineReducers } from 'redux'

import { ALTERATION_SUCCESS } from 'actions/alterations'
import {
  PLAYER_ERRORS_FAILURE,
  PLAYER_ERRORS_REQUEST,
  PLAYER_ERRORS_SUCCESS,
  PLAYER_TOKEN_FAILURE,
  PLAYER_TOKEN_REQUEST,
  PLAYER_TOKEN_SUCCESS,
  PLAYLIST_ENTRIES_FAILURE,
  PLAYLIST_ENTRIES_REQUEST,
  PLAYLIST_ENTRIES_SUCCESS,
} from 'actions/playlist'
import {
  PLAYLIST_DIGEST_FAILURE,
  PLAYLIST_DIGEST_REQUEST,
  PLAYLIST_DIGEST_SUCCESS,
} from 'actions/playlistDigest'
import { Status } from 'reducers/alterationsResponse'
import digest from 'reducers/playlistDigest'
import { updateData } from 'utils'

/**
 * This reducer contains playlist related state
 */

/**
 * Generators for playlist entries
 */

const generateDefaultPlaylistEntries = (playlistEntriesKey) => ({
  status: null,
  data: {
    pagination: {
      current: 1,
      last: 1,
    },
    count: 0,
    [playlistEntriesKey]: [],
  },
})

const generatePlaylistEntriesReducer = (playlistEntriesType) => {
  const defaultPlaylistEntries =
    generateDefaultPlaylistEntries(playlistEntriesType)

  return (state = defaultPlaylistEntries, action) => {
    if (action.playlistEntriesType !== playlistEntriesType) {
      return state
    }

    switch (action.type) {
      case PLAYLIST_ENTRIES_REQUEST:
        return {
          ...state,
          status: Status.pending,
        }

      case PLAYLIST_ENTRIES_SUCCESS:
        return {
          status: Status.successful,
          data: updateData(action.response, playlistEntriesType),
        }

      case PLAYLIST_ENTRIES_FAILURE:
        return {
          status: Status.failed,
          data: defaultPlaylistEntries.data,
        }

      default:
        return state
    }
  }
}

/**
 * Playlist of queuing entries
 */

const queuing = generatePlaylistEntriesReducer('queuing')

/**
 * playlist of played entries
 */

const played = generatePlaylistEntriesReducer('played')

/**
 * Player information from server
 */

const defaultPlayerStatus = {
  status: null,
  data: {
    playlist_entry: null,
    timing: 0,
    paused: false,
    in_transition: false,
    date: new Date().toString(),
  },
}

function playerStatus(state = defaultPlayerStatus, action) {
  switch (action.type) {
    case PLAYLIST_DIGEST_REQUEST:
      return {
        ...state,
        status: state.status || Status.pending,
      }

    case PLAYLIST_DIGEST_SUCCESS:
      return {
        status: Status.successful,
        data: action.response.player_status,
      }

    case PLAYLIST_DIGEST_FAILURE:
      return {
        ...state,
        status: Status.failed,
      }

    // if a pause command has been successfuly sent to the server,
    // adapt the state now
    case ALTERATION_SUCCESS:
      if (action.alterationName === 'sendPlayerCommand') {
        switch (action.elementId) {
          case 'pause':
            return {
              ...state,
              data: {
                ...state.data,
                paused: true,
              },
            }

          case 'resume':
            return {
              ...state,
              data: {
                ...state.data,
                paused: false,
              },
            }

          default:
            return state
        }
      }

      return state

    default:
      return state
  }
}

/**
 * Player errors reported from device
 */

const defaultPlayerErrors = {
  status: null,
  data: {
    pagination: {
      current: 1,
      last: 1,
    },
    count: 0,
    playerErrors: [],
  },
}

function playerErrors(state = defaultPlayerErrors, action) {
  switch (action.type) {
    case PLAYER_ERRORS_REQUEST:
      return {
        ...state,
        status: Status.pending,
      }

    case PLAYER_ERRORS_SUCCESS:
      return {
        status: Status.successful,
        data: updateData(action.response, 'playerErrors'),
      }

    case PLAYER_ERRORS_FAILURE:
      return {
        ...state,
        status: Status.failed,
      }

    default:
      return state
  }
}

/**
 * Karaoke information
 */

const defaultKaraoke = {
  status: null,
  data: {
    id: null,
    ongoing: false,
    can_add_to_playlist: false,
    player_play_next_song: false,
    date_stop: null,
  },
}

function karaoke(state = defaultKaraoke, action) {
  switch (action.type) {
    case PLAYLIST_DIGEST_REQUEST:
      return {
        ...state,
        status: state.status || Status.pending,
      }

    case PLAYLIST_DIGEST_SUCCESS:
      return {
        status: Status.successful,
        data: action.response.karaoke,
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

/**
 * Player token
 */

const defaultPlayerToken = {
  status: null,
  data: {
    karaoke_id: null,
    key: null,
  },
}

function playerToken(state = defaultPlayerToken, action) {
  switch (action.type) {
    case PLAYER_TOKEN_REQUEST:
      return {
        ...state,
        status: state.status || Status.pending,
      }

    case PLAYER_TOKEN_SUCCESS:
      return {
        status: Status.successful,
        data: action.response,
      }

    case PLAYER_TOKEN_FAILURE:
      // if the player token doesn't exist
      // TODO change to low level check
      if (action.error.detail === 'No PlayerToken matches the given query.') {
        return {
          status: Status.successful,
          data: {
            token: null,
          },
        }
      }

      return {
        ...state,
        status: Status.failed,
      }

    case ALTERATION_SUCCESS:
      // if the player token has been revoked
      if (action.alterationName === 'revokePlayerToken') {
        return {
          status: Status.successful,
          data: {
            token: null,
          },
        }
      }

      return state

    default:
      return state
  }
}

/**
 * Playlist
 */

const playlist = combineReducers({
  queuing,
  played,
  playerStatus,
  playerErrors,
  karaoke,
  playerToken,
  digest,
})

export default playlist
