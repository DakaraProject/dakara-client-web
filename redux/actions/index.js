import { CALL_API } from 'redux-api-middleware';
 
export const SONGS_REQUEST = 'SONGS_REQUEST'
export const SONGS_SUCCESS = 'SONGS_SUCCESS'
export const SONGS_FAILURE = 'SONGS_FAILURE'

const fetchSongs = (pageNumber) => ({
  [CALL_API]: {
      endpoint: `/library/songs/?page=${pageNumber}`,
      method: 'GET',
      headers: {Authorization: 'Token f9226303bc7814a4c6682b6b98032b5c8835b37f'},
      types: [SONGS_REQUEST, SONGS_SUCCESS, SONGS_FAILURE]
    }
})

/**
 * Load a page of songs from server
 * @param pageNumber page to load
 */
export const loadSongs = (pageNumber = 1) => (dispatch, getState) => {
    if(pageNumber == getState().libraryEntries.current) {
        return null
    }

    return dispatch(fetchSongs(pageNumber))
}
