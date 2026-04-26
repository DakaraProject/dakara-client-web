import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import {
  createPlayerToken,
  loadPlayerToken,
  revokePlayerToken,
} from 'actions/playlist'
import { revokeToken } from 'actions/token'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import NotificationBar from 'components/generics/NotificationBar'
import TokenWidget from 'components/generics/TokenWidget'
import { IsLibraryManager } from 'permissions/components/Library'
import { IsPlaylistManager } from 'permissions/components/Playlist'
import { Status } from 'reducers/alterationsResponse'
import { karaokePropType, playerTokenPropType } from 'serverPropTypes/playlist'

function PlayerTokenBoxDisplay({ playerToken, karaoke }) {
  const responseOfRevokePlayerToken = useSelector(
    (state) => state.alterationsResponse.unique.revokePlayerToken
  )

  const dispatch = useDispatch()

  const [confirmDisplayed, setConfirmDisplayed] = useState(false)

  return (
    <div className="player-token-box-display flow">
      <TokenWidget token={playerToken.key} />
      <div className="ribbon info copy-help">
        <p className="message">
          You can use this token to authenticate the player.
        </p>
      </div>
      <div className="revoke controls notifiable">
        <ConfirmationBar
          show={confirmDisplayed}
          setShow={setConfirmDisplayed}
          onConfirm={() => {
            dispatch(revokePlayerToken(karaoke.id))
          }}
        />
        <NotificationBar
          alterationResponse={responseOfRevokePlayerToken}
          pendingMessage={null}
          successfulMessage={null}
          failedMessage="Unable to revoke player token"
        />
        <button
          className="control primary"
          onClick={() => {
            setConfirmDisplayed(true)
          }}
        >
          Revoke player token
        </button>
      </div>
    </div>
  )
}

PlayerTokenBoxDisplay.propTypes = {
  playerToken: playerTokenPropType.isRequired,
  karaoke: karaokePropType.isRequired,
}

function PlayerTokenBoxCreate({ karaoke }) {
  const responseOfCreatePlayerToken = useSelector(
    (state) => state.alterationsResponse.unique.createPlayerToken
  )

  const dispatch = useDispatch()

  return (
    <div className="player-token-box-create flow">
      <p>Create a token that can be used to authenticate the player.</p>
      <div className="controls notifiable">
        <NotificationBar
          alterationResponse={responseOfCreatePlayerToken}
          pendingMessage={null}
          successfulMessage={null}
          failedMessage="Unable to create player token"
        />
        <button
          className="control primary"
          onClick={() => {
            dispatch(createPlayerToken(karaoke.id))
          }}
        >
          Create player token
        </button>
      </div>
    </div>
  )
}

PlayerTokenBoxCreate.propTypes = {
  karaoke: karaokePropType.isRequired,
}

function PlayerTokenBox() {
  const playerTokenState = useSelector((state) => state.playlist.playerToken)
  const karaokeState = useSelector((state) => state.playlist.karaoke)

  const dispatch = useDispatch()

  const { data: karaoke } = karaokeState
  const { id: karaokeId } = karaoke

  const { data: playerToken, status: playerTokenStatus } = playerTokenState
  const keyExists = !!playerToken.key

  useEffect(
    () => {
      // load player token as soon as the karaoke ID has been fetched
      if (!playerTokenStatus && karaokeId) {
        dispatch(loadPlayerToken(karaokeId))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playerTokenStatus, karaokeId]
  )

  // NOTE If the token is not found, the status is still `successful` as this
  // is a valid case. Check the reducer to see how this case is handled.

  let playerTokenBox
  if (playerTokenStatus === Status.successful) {
    playerTokenBox = (
      <CSSTransition
        in={keyExists}
        classNames="token-player"
        timeout={{
          enter: 300,
          exit: 150,
        }}
      >
        {keyExists ? (
          <PlayerTokenBoxDisplay playerToken={playerToken} karaoke={karaoke} />
        ) : (
          <PlayerTokenBoxCreate karaoke={karaoke} />
        )}
      </CSSTransition>
    )
  } else if (playerTokenStatus === Status.failed) {
    playerTokenBox = (
      <div className="ribbon danger">
        <p>Unable to get player token.</p>
      </div>
    )
  } else {
    playerTokenBox = (
      <div className="ribbon">
        <p>Pending…</p>
      </div>
    )
  }

  return (
    <div className="token-box player flow">
      <h3>Player token</h3>
      {playerTokenBox}
    </div>
  )
}

export default function Tokens() {
  const userToken = useSelector((state) => state.token)
  const user = useSelector((state) => state.authenticatedUser)
  const responseOfRevokeToken = useSelector(
    (state) => state.alterationsResponse.unique.revokeToken
  )

  const [confirmDisplayed, setConfirmDisplayed] = useState(false)

  const dispatch = useDispatch()

  return (
    <div id="tokens" className="flow">
      <div className="token-box user flow">
        <h3>User token</h3>
        <TokenWidget token={userToken} />
        <IsLibraryManager user={user}>
          <div className="ribbon info copy-help">
            <p className="message">
              You can use this token to authenticate the feeder.
            </p>
          </div>
        </IsLibraryManager>
        <div className="revoke controls notifiable">
          <ConfirmationBar
            message="This will disconnect you from
                              all your devices. Are you sure?"
            show={confirmDisplayed}
            setShow={setConfirmDisplayed}
            onConfirm={() => {
              dispatch(revokeToken())
            }}
          />
          <NotificationBar
            alterationResponse={responseOfRevokeToken}
            pendingMessage={null}
            successfulMessage={null}
            failedMessage="Unable to revoke token"
          />
          <button
            className="control primary"
            onClick={() => {
              setConfirmDisplayed(true)
            }}
          >
            Revoke token
          </button>
        </div>
      </div>
      <IsPlaylistManager user={user}>
        <PlayerTokenBox />
      </IsPlaylistManager>
    </div>
  )
}
