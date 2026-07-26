import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadPlaylistDigest } from 'actions/playlistDigest'
import KaraStatusNotification from 'components/karaoke/KaraStatusNotification'
import Player from 'components/karaoke/player/Player'
import { isPlaylistManager } from 'permissions/playlist'
import { Status } from 'reducers/alterationsResponse'
import { params, setIntervalNow } from 'utils'

export default function Karaoke() {
  const karaokeState = useSelector((state) => state.playlist.karaoke)
  const user = useSelector((state) => state.authenticatedUser)
  const { status: karaokeStatus } = karaokeState

  const dispatch = useDispatch()

  useEffect(
    () => {
      // get evolution of the playlist periodically
      const interval = setIntervalNow(() => {
        if (karaokeStatus !== Status.pending) {
          dispatch(loadPlaylistDigest())
        }
      }, params.pollInterval)

      return () => {
        clearInterval(interval)
      }
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [karaokeStatus]
  )

  const { data: karaoke } = karaokeState
  const [displayIsBlocked, setDisplayIsBlocked] = useState(true)

  // do not display anything until first load of digest
  if (!karaokeStatus) {
    return null
  }

  // do not display anything until the digest has been loaded at least once
  if (displayIsBlocked) {
    if (karaokeStatus === Status.pending) {
      return null
    }

    setDisplayIsBlocked(false)
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
