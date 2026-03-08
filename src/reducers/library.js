import { combineReducers } from 'redux'

import {
  LIBRARY_FAILURE,
  LIBRARY_REQUEST,
  LIBRARY_SUCCESS,
  SONG_LYRICS_FAILURE,
  SONG_LYRICS_REQUEST,
  SONG_LYRICS_SUCCESS,
  WORK_TYPES_FAILURE,
  WORK_TYPES_REQUEST,
  WORK_TYPES_SUCCESS,
} from 'actions/library'
import { Status } from 'reducers/alterationsResponse'
import { updateData } from 'utils'

/**
 * This reducer contains library related state
 */

/**
 * Work link complete name
 */

export const WorkLinkName = Object.freeze({
  OP: 'Opening',
  ED: 'Ending',
  IN: 'Insert song',
  IS: 'Image song',
})

/**
 * Generators for library content
 */

const generateLibraryDefaultState = (libraryKey) => ({
  status: null,
  data: {
    pagination: {
      current: 1,
      last: 1,
    },
    count: 0,
    query: {},
    [libraryKey]: [],
  },
})

const generateLibraryReducer =
  (libraryType, defaultState) =>
  (state = defaultState, action) => {
    if (action.libraryType !== libraryType) {
      return state
    }

    switch (action.type) {
      case LIBRARY_REQUEST:
        return {
          ...state,
          status: Status.pending,
        }

      case LIBRARY_SUCCESS:
        return {
          status: Status.successful,
          data: updateData(action.response, libraryType),
        }

      case LIBRARY_FAILURE:
        return {
          status: Status.failed,
          data: defaultState.data,
        }

      default:
        return state
    }
  }

/**
 * Song library
 */

const songLibraryDefaultState = generateLibraryDefaultState('songs')
const songDefaultState = {
  ...songLibraryDefaultState,
  statusLyrics: null,
}
const songLibraryReducer = generateLibraryReducer('songs', songDefaultState)
const song = (stateLibrary = songDefaultState, action) => {
  const state = songLibraryReducer(stateLibrary, action)

  switch (action.type) {
    case SONG_LYRICS_REQUEST:
      return {
        ...state,
        statusLyrics: Status.pending,
      }

    case SONG_LYRICS_SUCCESS: {
      // add the lyrics to the corresponding song
      const songs = window.structuredClone(state.data.songs)
      const songId = songs.findIndex((song) => song.id === action.response.id)
      songs[songId].lyrics_preview.text = action.response.lyrics

      return {
        ...state,
        statusLyrics: Status.successful,
        data: {
          ...state.data,
          songs,
        },
      }
    }

    case SONG_LYRICS_FAILURE:
      return {
        ...state,
        statusLyrics: Status.failed,
      }

    default:
      return state
  }
}

/**
 * Artist library
 */

const artistLibraryDefaultState = generateLibraryDefaultState('artists')
const artist = generateLibraryReducer('artists', artistLibraryDefaultState)

/**
 * Work library
 */

const defaultWork = generateLibraryDefaultState('works')

function works(state = {}, action) {
  // create works when work types have been successfuly fetched
  if (action.type === WORK_TYPES_SUCCESS) {
    let newState = { ...state }
    for (let type of action.response.results) {
      const name = type.query_name
      if (typeof newState[name] === 'undefined') {
        newState[name] = defaultWork
      }
    }

    return newState
  }

  if (action.libraryType !== 'works') {
    return state
  }

  const workType = action.workType

  switch (action.type) {
    case LIBRARY_REQUEST:
      return {
        ...state,
        [workType]: {
          ...state[workType],
          status: Status.pending,
        },
      }

    case LIBRARY_SUCCESS:
      return {
        ...state,
        [workType]: {
          status: Status.successful,
          data: updateData(action.response, 'works'),
        },
      }

    case LIBRARY_FAILURE:
      return {
        ...state,
        [workType]: {
          status: Status.failed,
          data: defaultWork.data,
        },
      }

    default:
      return state
  }
}

/**
 * Work Types
 */

const defaultWorkType = {
  status: null,
  data: {
    workTypes: [],
  },
}

function workType(state = defaultWorkType, action) {
  switch (action.type) {
    case WORK_TYPES_REQUEST:
      return {
        ...state,
        status: Status.pending,
      }

    case WORK_TYPES_SUCCESS:
      return {
        status: Status.successful,
        data: updateData(action.response, 'workTypes'),
      }

    case WORK_TYPES_FAILURE:
      return {
        status: Status.failed,
        data: defaultWorkType.data,
      }

    default:
      return state
  }
}

/**
 * Library
 */

export default combineReducers({
  song,
  artist,
  works,
  workType,
})
