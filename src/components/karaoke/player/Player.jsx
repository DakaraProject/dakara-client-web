import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

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
import {
  alterationResponsePropType,
  Status,
} from 'reducers/alterationsResponse'
import { playerStatusStatePropType } from 'reducers/playlist'
import { playerErrorsDigestStatePropType } from 'reducers/playlistDigest'
import { userPropType } from 'serverPropTypes/users'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

class Player extends Component {
  static propTypes = {
    playerErrorsDigestState: playerErrorsDigestStatePropType.isRequired,
    playerStatusState: playerStatusStatePropType.isRequired,
    responseOfSendPlayerCommands: PropTypes.objectOf(
      alterationResponsePropType
    ),
    sendPlayerCommand: PropTypes.func.isRequired,
    user: userPropType.isRequired,
    navigate: PropTypes.func.isRequired,
  }

  state = {
    withControls: false,
    animationsEnabled: false,
  }

  componentDidMount() {
    const { user } = this.props
    const { data: playerStatus } = this.props.playerStatusState
    const withControls = IsPlaylistManagerOrOwner.hasPermission(
      user,
      playerStatus.playlist_entry
    )

    if (withControls) {
      this.setState({ withControls })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user: prevUser } = prevProps
    const { user } = this.props
    const { data: playerStatus } = this.props.playerStatusState
    const { data: prevPlayerStatus } = prevProps.playerStatusState

    // display controls or not
    if (user !== prevUser || playerStatus !== prevPlayerStatus) {
      const { withControls: prevWithControls } = this.state
      const withControls = IsPlaylistManagerOrOwner.hasPermission(
        user,
        playerStatus.playlist_entry
      )

      if (withControls !== prevWithControls) {
        this.setState({ withControls, animationsEnabled: true })
      }
    }
  }

  handleSearch = (song) => {
    const query = `title:""${song.title}""`
    this.props.navigate({
      pathname: '/library/song',
      search: queryString.stringify({
        query,
        expanded: song.id,
      }),
    })
  }

  render() {
    const { withControls, animationsEnabled } = this.state
    const { data: playerStatus } = this.props.playerStatusState
    const { playerErrors } = this.props.playerErrorsDigestState.data
    const fetchError = this.props.playerStatusState.status === Status.failed
    const isPlaying = !!playerStatus.playlist_entry
    const controlDisabled = !isPlaying || fetchError

    /**
     * Create a safe version of the send player commands alteration status
     * with default values
     */

    const responseOfSendPlayerCommandsSafe = {
      pause: { status: null },
      resume: { status: null },
      restart: { status: null },
      skip: { status: null },
      rewind: { status: null },
      fast_forward: { status: null },
      ...this.props.responseOfSendPlayerCommands,
    }

    /**
     * Display playlist entry if any song is currently playing
     */

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
              onClick={() => this.props.sendPlayerCommand('restart')}
              disabled={controlDisabled}
              error={fetchError}
              icon="step-backward"
            />
            <ManageButton
              responseOfManage={responseOfSendPlayerCommandsSafe.rewind}
              onClick={() => this.props.sendPlayerCommand('rewind')}
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
                  this.props.sendPlayerCommand('resume')
                } else {
                  this.props.sendPlayerCommand('pause')
                }
              }}
              disabled={controlDisabled}
              error={fetchError}
              icon={
                isPlaying ? (playerStatus.paused ? 'play' : 'pause') : 'stop'
              }
            />
            <ManageButton
              responseOfManage={responseOfSendPlayerCommandsSafe.fast_forward}
              onClick={() => this.props.sendPlayerCommand('fast_forward')}
              disabled={controlDisabled}
              error={fetchError}
              icon="forward"
            />
            <ManageButton
              responseOfManage={responseOfSendPlayerCommandsSafe.skip}
              onClick={() => this.props.sendPlayerCommand('skip', true)}
              disabled={controlDisabled}
              error={fetchError}
              icon="step-forward"
            />
          </div>
        </CSSTransitionLazy>
        <progress
          className={classNames(
            'progressbar',
            fetchError ? 'danger' : 'primary'
          )}
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

const mapStateToProps = (state) => ({
  user: state.authenticatedUser,
  playerStatusState: state.playlist.playerStatus,
  playerErrorsDigestState: state.playlist.digest.playerErrors,
  responseOfSendPlayerCommands:
    state.alterationsResponse.multiple.sendPlayerCommands,
})

Player = withNavigate(
  connect(mapStateToProps, {
    sendPlayerCommand,
  })(Player)
)

export default Player
