import { combineReducers } from 'redux'
import PropTypes from 'prop-types'
import { LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE } from 'actions/library'
import { WORK_TYPES_REQUEST, WORK_TYPES_SUCCESS, WORK_TYPES_FAILURE } from 'actions/library'
import { songPropType, artistPropType, workPropType, workTypePropType } from 'serverPropTypes/library'
import { Status } from './alterationsResponse'
import { updateData } from 'utils'

/**
 * This reducer contains library related state
 */

/**
 * Generators for library content
 */

const generateLibraryPropType = (libraryEntryPropType, libraryKey) => (
    PropTypes.shape({
        status: PropTypes.symbol,
        data: PropTypes.shape({
            pagination: PropTypes.shape({
                current: PropTypes.number.isRequired,
                last: PropTypes.number.isRequired,
            }).isRequired,
            count: PropTypes.number.isRequired,
            query: PropTypes.object,
            [libraryKey]: PropTypes.arrayOf(libraryEntryPropType).isRequired,
        }),
    })
)

const generateDefaultLibrary = (libraryKey) => ({
    status: null,
    data: {
        pagination: {
            current: 1,
            last: 1,
        },
        count: 0,
        query: {},
        [libraryKey]: []
    },
})

const generateLibraryReducer = libraryType => {
    const defaultLibrary = generateDefaultLibrary(libraryType)

    return (state = defaultLibrary, action) => {
        if (action.libraryType != libraryType) {
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
                    data: defaultLibrary.data,
                }

            default:
                return state
        }
    }
}

/**
 * Song library
 */

export const songStatePropType = generateLibraryPropType(songPropType, "songs")
const song = generateLibraryReducer("songs")

/**
 * Artist library
 */

export const artistStatePropType = generateLibraryPropType(artistPropType, "artists")
const artist = generateLibraryReducer("artists")

/**
 * Work library
 */

export const workStatePropType = generateLibraryPropType(workPropType, "works")
const defaultWork = generateDefaultLibrary("works")

function works(state = {}, action) {
    // create works when work types have been successfuly fetched
    if (action.type === WORK_TYPES_SUCCESS) {
        let newState = {...state}
        for (let type of action.response.results) {
            const name = type.query_name
            if (typeof newState[name] === 'undefined') {
                newState[name] = defaultWork
            }
        }

        return newState
    }

    if (action.libraryType != "works") {
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
                }
            }

        case LIBRARY_SUCCESS:
            return {
                ...state,
                [workType]: {
                    status: Status.successful,
                    data: updateData(action.response, "works"),
                }
            }

        case LIBRARY_FAILURE:
            return {
                ...state,
                [workType]: {
                    status: Status.failed,
                    data: defaultWork.data,
                }
            }

        default:
            return state
    }
}

/**
 * Work Types
 */

export const workTypeStatePropType = PropTypes.shape({
    status: PropTypes.symbol,
    data: PropTypes.shape({
        workTypes: PropTypes.arrayOf(workTypePropType).isRequired,
    }).isRequired,
})

const defaultWorkType =  {
    status: null,
    data: {
        workTypes: []
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
                data: updateData(action.response, "workTypes")
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
