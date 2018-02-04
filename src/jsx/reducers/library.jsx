import { combineReducers } from 'redux'
import { LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE } from 'actions'
import { WORK_TYPES_REQUEST, WORK_TYPES_SUCCESS, WORK_TYPES_FAILURE } from 'actions'
import songTags from './songTags'

/**
 * This reducer contains library related state
 */


/**
 * Current content of the library
 */

const defaultLibraryEntries =  {
    data: {
        current: 1,
        last: 1,
        count: 0,
        results: []
    },
    isFetching: false,
    fetchError: false
}

const generateLibraryReducer = libraryType => (state = defaultLibraryEntries, action) => {
    if (action.libraryType != libraryType) {
        return state
    }

    switch (action.type) {
        case LIBRARY_REQUEST:
            return {
                ...state,
                isFetching: true,
                fetchError: false
            }

        case LIBRARY_SUCCESS:
            return {
                data: action.response,
                isFetching: false,
                fetchError: false
            }

        case LIBRARY_FAILURE:
            return {
                data: defaultLibraryEntries.data,
                isFetching: false,
                fetchError: true
            }

        default:
            return state
    }
}

const song = generateLibraryReducer("songs")
const artist = generateLibraryReducer("artists")

function work(state = {}, action) {
    if (action.type === WORK_TYPES_SUCCESS) {
        let newState = {...state}
        for (let type of action.response.results) {
            const name = type.query_name
            if (newState[name] == undefined) {
                newState[name] = defaultLibraryEntries
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
                    isFetching: true,
                    fetchError: false
                }
            }

        case LIBRARY_SUCCESS:
            return {
                ...state,
                [workType]: {
                    ...state[workType],
                    data: action.response,
                    isFetching: false,
                    fetchError: false
                }
            }

        case LIBRARY_FAILURE:
            return {
                ...state,
                [workType]: {
                    ...state[workType],
                    data: defaultLibraryEntries.data,
                    isFetching: false,
                    fetchError: true
                }
            }

        default:
            return state
    }
}
/**
 * Work Types
 */

const defaultWorkTypes =  {
    data: {
        results: []
    },
    hasFetched: false
}

function workTypes(state = defaultWorkTypes, action) {
    if (action.type === WORK_TYPES_SUCCESS) {
        return {
            data: action.response,
            hasFetched: true
        }
    } else {
        return state
    }
}


const library = combineReducers({
    song,
    artist,
    work,
    workTypes,
    songTags
})

export default library
