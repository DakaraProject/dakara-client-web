import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPlaylistDigest } from 'actions/playlistDigest'
import KaraStatusNotification from 'components/karaoke/KaraStatusNotification'
import Player from 'components/karaoke/player/Player'
import { IsPlaylistManager } from 'permissions/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { params } from 'utils'

export default function Karaoke() {
  const karaokeState = useSelector((state) => state.playlist.karaoke)
  const user = useSelector((state) => state.authenticatedUser)

  const dispatch = useDispatch()

  useEffect(() => {
    // get evolution of the playlist periodically
    const interval = setInterval(() => {
      if (karaokeState.status !== Status.pending) {
        dispatch(loadPlaylistDigest())
      }
    }, params.pollInterval)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch, karaokeState.status])

  const { data: karaoke } = karaokeState

  if (!karaoke.ongoing) {
    if (IsPlaylistManager.hasPermission(user)) {
      return <KaraStatusNotification />
    }

    return null
  }

  return <Player />
}
