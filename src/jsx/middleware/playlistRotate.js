import { DEVICE_NEW_ENTRY, PLAYLIST_PLAYED_ADD } from 'actions/playlist'

export default ({getState, dispatch}) => next => action => {
    if (action.type !== DEVICE_NEW_ENTRY ) return next(action)

    const state = getState()
    const oldCurrentEntry = state.playlist.playerStatus.data.currentEntry

    if (oldCurrentEntry) dispatch({
        type: PLAYLIST_PLAYED_ADD,
        entry: oldCurrentEntry
    })

    return next(action)
}
