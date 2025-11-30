import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPlaylistDigest } from 'actions/playlistDigest'
import KaraStatusNotification from 'components/karaoke/KaraStatusNotification'
import Player from 'components/karaoke/player/Player'
import { useIsPlaylistManager } from 'permissions/playlist'
import { Status } from 'reducers/alterationsResponse'
import { params } from 'utils'

export default function Karaoke() {
  const karaokeState = useSelector((state) => state.playlist.karaoke)
  const user = useSelector((state) => state.authenticatedUser)
  const { status: karaokeStatus } = karaokeState

  const dispatch = useDispatch()

  const isPlaylistManager = useIsPlaylistManager()

  useEffect(
    () => {
      // get evolution of the playlist periodically
      const interval = setInterval(() => {
        if (karaokeStatus !== Status.pending) {
          dispatch(loadPlaylistDigest())
        }
      }, params.pollInterval)

      return () => {
        clearInterval(interval)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [karaokeStatus]
  )

  const { data: karaoke } = karaokeState

  // do not display anything until first load of digest
  if (!karaokeStatus) {
    return null
  }

  if (!karaoke.ongoing) {
    if (isPlaylistManager(user)) {
      return <KaraStatusNotification />
    }

    return null
  }

  return <Player />
}
