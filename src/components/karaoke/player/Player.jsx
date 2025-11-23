import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { sendPlayerCommand } from 'actions/playlist'
import { Carousel } from 'components/generics/Carousel'
import {
  CarouselEntryCurrentSong,
  CarouselEntryNextSong,
  CarouselEntryStats,
} from 'components/karaoke/player/Carousel'
import ManageButton from 'components/karaoke/player/ManageButton'
import PlayerNotification from 'components/karaoke/player/Notification'
import { IsPlaylistManagerOrOwner } from 'permissions/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

export default function Player() {
  const user = useSelector((state) => state.authenticatedUser)
  const playerStatusState = useSelector((state) => state.playlist.playerStatus)
  const playerErrorsDigestState = useSelector(
    (state) => state.playlist.digest.playerErrors
  )
  const responseOfSendPlayerCommands = useSelector(
    (state) => state.alterationsResponse.multiple.sendPlayerCommands
  )

  const [animationsEnabled, setAnimationsEnabled] = useState(false)

  const dispatch = useDispatch()

  const { data: playerStatus } = playerStatusState
  const withControls = IsPlaylistManagerOrOwner.hasPermission(
    user,
    playerStatus.playlist_entry
  )

  useEffect(() => {
    // enable animations if the user, the player status, or the possibility to
    // use controls changes
    setAnimationsEnabled(true)
  }, [user, playerStatus, withControls])

  const { playerErrors } = playerErrorsDigestState.data
  const fetchError = playerStatusState.status === Status.failed
  const isPlaying = !!playerStatus.playlist_entry
  const controlDisabled = !isPlaying || fetchError

  // create a safe version of the send player commands alteration status with
  // default values
  const responseOfSendPlayerCommandsSafe = {
    pause: { status: null },
    resume: { status: null },
    restart: { status: null },
    skip: { status: null },
    rewind: { status: null },
    fast_forward: { status: null },
    ...responseOfSendPlayerCommands,
  }

  // display playlist entry if any song is currently playing
  let progress = 0
  if (isPlaying) {
    const { song } = playerStatus.playlist_entry
    if (!playerStatus.in_transition && song.duration > 0) {
      progress = Math.min(playerStatus.timing / song.duration, 1)
    } else {
      progress = undefined
    }
  }

  return (
    <div
      id="player"
      className={classNames('box', fetchError ? 'danger' : 'primary')}
    >
      {fetchError ? (
        <ServerLost />
      ) : (
        <Carousel className={fetchError ? 'danger' : 'primary'}>
          <CarouselEntryCurrentSong />
          <CarouselEntryNextSong />
          <CarouselEntryStats />
        </Carousel>
      )}
      <CSSTransitionLazy
        in={withControls}
        classNames="expand"
        timeout={{
          enter: 300,
          exit: 150,
        }}
        enter={animationsEnabled}
        exit={animationsEnabled}
      >
        <div className="controls">
          <ManageButton
            responseOfManage={responseOfSendPlayerCommandsSafe.restart}
            onClick={() => {
              dispatch(sendPlayerCommand('restart'))
            }}
            disabled={controlDisabled}
            error={fetchError}
            icon="step-backward"
          />
          <ManageButton
            responseOfManage={responseOfSendPlayerCommandsSafe.rewind}
            onClick={() => {
              dispatch(sendPlayerCommand('rewind'))
            }}
            disabled={controlDisabled}
            error={fetchError}
            icon="backward"
          />
          <ManageButton
            responseOfManage={
              playerStatus.paused
                ? responseOfSendPlayerCommandsSafe.resume
                : responseOfSendPlayerCommandsSafe.pause
            }
            onClick={() => {
              if (!isPlaying) return

              if (playerStatus.paused) {
                dispatch(sendPlayerCommand('resume'))
              } else {
                dispatch(sendPlayerCommand('pause'))
              }
            }}
            disabled={controlDisabled}
            error={fetchError}
            icon={isPlaying ? (playerStatus.paused ? 'play' : 'pause') : 'stop'}
          />
          <ManageButton
            responseOfManage={responseOfSendPlayerCommandsSafe.fast_forward}
            onClick={() => {
              dispatch(sendPlayerCommand('fast_forward'))
            }}
            disabled={controlDisabled}
            error={fetchError}
            icon="forward"
          />
          <ManageButton
            responseOfManage={responseOfSendPlayerCommandsSafe.skip}
            onClick={() => {
              dispatch(sendPlayerCommand('skip', true))
            }}
            disabled={controlDisabled}
            error={fetchError}
            icon="step-forward"
          />
        </div>
      </CSSTransitionLazy>
      <progress
        className={classNames('progressbar', fetchError ? 'danger' : 'primary')}
        value={progress}
      >
        {progress}
      </progress>
      <PlayerNotification
        alterationsResponse={responseOfSendPlayerCommandsSafe}
        playerErrors={playerErrors}
      />
    </div>
  )
}

const ServerLost = () => (
  <div className="server-lost danger">
    <div className="message">Unable to get status from server</div>
    <div className="pending">
      <span className="point">·</span>
      <span className="point">·</span>
      <span className="point">·</span>
    </div>
  </div>
)
