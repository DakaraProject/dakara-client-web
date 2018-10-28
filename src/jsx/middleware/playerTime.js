import { PLAYLIST_DIGEST_SUCCESS, PLAYLIST_PLAYER_TIMING_UPDATE } from "actions/playlist"

const functions = {}

export default ({getState, dispatch}) => next => action => {
    const update = () => {
        const state = getState()

        // compute the new timing
        const timing = state.playlist.digest.data.player_status.timing + 1

        // request to update player time
        console.log("updating timing now")
        dispatch({
            type: PLAYLIST_PLAYER_TIMING_UPDATE,
            timing
        })

        // call this method after
        functions.updater = setTimeout(update, 1000)
    }

    // apply the middleware only for playlist digest update
    if (action.type !== PLAYLIST_DIGEST_SUCCESS) return next(action)

    const { player_status: playerStatus } = action.response
    const state = getState()
    const { player_status: oldPlayerStatus } = state.playlist.digest.data

    // inhib the action if the state is the same
    // TODO this should be deleted when moving to full websocket support
    if (playerStatus.date === oldPlayerStatus.date) {
        return
    }

    // if the player becomes idle
    // or if the player becomes paused
    // or if the music changed, stop the updater
    // TODO this should be more easily handled by websocket actions
    if (
        playerStatus.playlist_entry === null ||
        playerStatus.paused ||
        playerStatus.playlist_entry !== oldPlayerStatus.playlist_entry && playerStatus.in_transition
    ) {
        console.log("clearing timeout")
        clearTimeout(functions.updater) // it is not a problem if the
                                        // handle is undefined
        return next(action)
    }

    // if the player becomes playing, launch the updater
    update()
    return next(action)
}
