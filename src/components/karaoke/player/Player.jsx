import classNames from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router'

import { sendPlayerCommand } from 'actions/playlist'
import ManageButton from 'components/karaoke/player/ManageButton'
import PlayerNotification from 'components/karaoke/player/Notification'
import PlaylistEntryWidget from 'components/playlist/widgets/PlaylistEntry'
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
import { formatDate, formatDuration, isDisplayable } from 'utils'

dayjs.extend(relativeTime)

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
            <CarouselEntryStats />
            <CarouselEntryCurrentSong />
            <CarouselEntryNextSong />
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

function Carousel({ children, className }) {
  return (
    <div className={classNames('carousel', className)}>
      <ul className="viewport">{children}</ul>
    </div>
  )
}

Carousel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

function CarouselEntry({ children, className, jumbo }) {
  return (
    <li className="carousel-entry">
      {isDisplayable(jumbo) && <div className="jumbo">{jumbo}</div>}
      <div className="content" tabIndex="0">
        <div className={className}>{children}</div>
      </div>
    </li>
  )
}

CarouselEntry.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  jumbo: PropTypes.string,
}

function CarouselEntryCurrentSong() {
  const { data: playerStatus } = useSelector(
    (state) => state.playlist.playerStatus
  )
  const { playlist_entry: entry, timing } = playerStatus

  if (!entry) {
    return null
  }

  return (
    <CarouselEntry className="current-song">
      <Link
        className="to-song"
        to={{
          pathname: '/library/song',
          search: queryString.stringify({
            query: `title:""${entry.song.title}""`,
            expanded: entry.song.id,
          }),
        }}
      >
        <PlaylistEntryWidget
          entry={entry}
          noRelativeDate
          songProps={{ noRelations: false }}
        />
      </Link>
      <div className="timing">
        <div className="current">{formatDuration(timing)}</div>
        <div className="duration">{formatDuration(entry.song.duration)}</div>
      </div>
    </CarouselEntry>
  )
}

function CarouselEntryNextSong() {
  const { playlistEntries } = useSelector(
    (state) => state.playlist.digest.entries.data
  )
  const entry = playlistEntries.find((e) => e.will_play)

  if (!entry) {
    return null
  }

  return (
    <CarouselEntry jumbo="Next" className="next-song">
      <Link
        to={{
          pathname: '/library/song',
          search: queryString.stringify({
            query: `title:""${entry.song.title}""`,
            expanded: entry.song.id,
          }),
        }}
      >
        <PlaylistEntryWidget entry={entry} />
      </Link>
    </CarouselEntry>
  )
}

function CarouselEntryStats() {
  const { playlistEntries, dateEnd } = useSelector(
    (state) => state.playlist.digest.entries.data
  )
  const { data: playerStatus } = useSelector(
    (state) => state.playlist.playerStatus
  )
  const { date_stop: karaokeDateStop } = useSelector(
    (state) => state.playlist.karaoke.data
  )
  const countPlayed = playlistEntries.filter((e) => e.was_played).length
  const countQueueing = playlistEntries.filter((e) => e.will_play).length

  /**
   * Played songs
   */

  let played
  switch (countPlayed) {
    case 0:
      played = <li>The karaoke has just started!</li>
      break
    case 1:
      played = <li>One song played, keep going!</li>
      break
    default:
      played = (
        <li>
          <q>{countPlayed}</q> songs played so far
        </li>
      )
  }

  /**
   * Queuing songs
   */

  let queuing
  switch (countQueueing) {
    case 0:
      queuing = <li>No songs queued in playlist yet</li>
      break
    case 1:
      queuing = <li>One song queued in playlist, add more!</li>
      break
    default:
      queuing = (
        <li>
          <q>{countQueueing}</q> songs queued in playlist
        </li>
      )
  }

  /**
   * Display karaoke end or playlist end
   *
   * The code is voluntary redundant, as the different cases do not factor
   * well together. At least, the code is easy to understand.
   */

  const playlistEndDate =
    dateEnd && (countQueueing || playerStatus.playlist_entry)
      ? dayjs(dateEnd)
      : null
  const karaokeEndDate = karaokeDateStop ? dayjs(karaokeDateStop) : null

  let end
  // only playlist date end
  if (playlistEndDate && !karaokeEndDate) {
    end = (
      <li>
        Playlist ends at <q>{formatDate(playlistEndDate)}</q>
      </li>
    )
    // only karaoke date end
  } else if (!playlistEndDate && karaokeEndDate) {
    if (karaokeEndDate.isAfter()) {
      end = (
        <>
          <li>
            Karaoke ends at <q>{formatDate(karaokeEndDate)}</q>
          </li>
          <li>
            <q>{dayjs().to(karaokeEndDate, true)}</q> remaining
          </li>
        </>
      )
    } else {
      end = <li>Karaoke ended</li>
    }
    // both playlist date end and karaoke date end
  } else if (playlistEndDate && karaokeEndDate) {
    // karaoke date end is after playlist date end
    if (karaokeEndDate.isAfter(playlistEndDate)) {
      end = (
        <>
          <li>
            Karaoke ends at <q>{formatDate(karaokeEndDate)}</q>
          </li>
          <li>
            <q>{dayjs().to(karaokeEndDate, true)}</q> remaining
          </li>
        </>
      )
      // playlist date end is after karaoke date end
    } else {
      end = (
        <>
          <li>
            Playlist should end after karaoke at{' '}
            <q>{formatDate(playlistEndDate)}</q>
          </li>
          <li>Playlist exceeds karaoke scheduled end!</li>
        </>
      )
    }
  }

  return (
    <CarouselEntry jumbo="Stats" className="stats">
      <ul>
        {played}
        {queuing}
        {end}
      </ul>
    </CarouselEntry>
  )
}
