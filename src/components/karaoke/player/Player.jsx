import classNames from 'classnames'
import { IsPlaylistManagerOrOwner } from 'permissions/Playlist'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'
import { withNavigate } from 'thirdpartyExtensions/ReactRouterDom'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

import { sendPlayerCommand } from 'actions/playlist'
import UserWidget from 'components/generics/UserWidget'
import ManageButton from 'components/karaoke/player/ManageButton'
import PlayerNotification from 'components/karaoke/player/Notification'
import ArtistWidget from 'components/song/ArtistWidget'
import WorkLinkWidget from 'components/song/WorkLinkWidget'
import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'
import { playerStatusStatePropType } from 'reducers/playlist'
import {
    playerErrorsDigestStatePropType
} from 'reducers/playlistDigest'
import { userPropType } from 'serverPropTypes/users'
import { formatDuration } from 'utils'

class Player extends Component {
    static propTypes = {
        playerErrorsState: playerErrorsDigestStatePropType.isRequired,
        playerStatusState: playerStatusStatePropType.isRequired,
        responseOfSendPlayerCommands: PropTypes.objectOf(alterationResponsePropType),
        sendPlayerCommand: PropTypes.func.isRequired,
        setWithControls: PropTypes.func.isRequired,
        user: userPropType.isRequired,
        navigate: PropTypes.func.isRequired,
    }

    state = {
        withControls: false,
        animationsEnabled: false
    }

    componentDidMount() {
        const { user } = this.props
        const { data: playerStatus } = this.props.playerStatusState
        const withControls = IsPlaylistManagerOrOwner.hasPermission(
            user,
            playerStatus.playlist_entry
        )

        if (withControls) {
            this.setState({withControls})
            this.props.setWithControls(withControls)
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
                this.setState({withControls, animationsEnabled: true})
                this.props.setWithControls(withControls)
            }
        }
    }

    handleSearch = (song) => {
        const query = `title:""${song.title}""`
        this.props.navigate({
            pathname: '/library/song',
            search: queryString.stringify({
                query,
                expanded: song.id
            })
        })
    }

    render() {
        const { withControls, animationsEnabled } = this.state
        const { data: playerStatus } = this.props.playerStatusState
        const { data: playerErrors } = this.props.playerErrorsState
        const fetchError = this.props.playerStatusState.status === Status.failed
        const isPlaying = !!playerStatus.playlist_entry
        const controlDisabled = !isPlaying || fetchError

        /**
         * Create a safe version of the send player commands alteration status
         * with default values
         */

        const responseOfSendPlayerCommandsSafe = {
            pause: {status: null},
            resume: {status: null},
            restart: {status: null},
            skip: {status: null},
            rewind: {status: null},
            fast_forward: {status: null},
            ...this.props.responseOfSendPlayerCommands,
        }

        /**
         * Server lost widget
         */
        const serverLost = (
            <CSSTransitionLazy
                in={fetchError}
                classNames="notified"
                timeout={{
                    enter: 300,
                    exit: 150
                }}
            >
                <ServerLost/>
            </CSSTransitionLazy>
        )

        /**
         * Display playlist entry if any song is currently playing
         */

        let progress
        let info
        if (isPlaying) {
            const { song, owner, use_instrumental } = playerStatus.playlist_entry

            /**
             * Manage instrumental playlist entry
             */
            let useInstrumental
            if (use_instrumental) {
                useInstrumental = (
                    <div className="use-instrumental">
                        <span className="icon">
                            <i className="las la-microphone-slash"></i>
                        </span>
                    </div>
                )
            }

            // the progress is displayed only when the song has really started
            // and only if the song has a known duration
            if (!playerStatus.in_transition && song.duration > 0) {
                progress = Math.min(playerStatus.timing * 100 / song.duration, 100)
            }

            info = (
                <div className="player-info">
                    <div className="playlist-entry">
                        {useInstrumental}
                        <button
                            className="entry-info transparent"
                            onClick={() => {
                                this.handleSearch(song)
                            }}
                        >
                            <div className="song-title">
                                {song.title}
                            </div>
                            <div className="song-artists">
                                {song.artists.map(a => (
                                    <ArtistWidget artist={a} key={a.id} truncatable />
                                ))}
                            </div>
                            <div className="song-works">
                                {song.works.map(w => (
                                    <WorkLinkWidget
                                        workLink={w}
                                        key={w.id}
                                        noEpisodes
                                        truncatable
                                    />
                                ))}
                            </div>
                            <UserWidget user={owner} noResize />
                        </button>
                    </div>
                    <div className="timing">
                        <div className="current">
                            {formatDuration(playerStatus.timing)}
                        </div>
                        <div className="duration">
                            {formatDuration(song.duration)}
                        </div>
                    </div>
                </div>
            )
        } else {
            progress = 0
            info = (
                <div className="player-info">
                    <div className="playlist-entry">
                    </div>
                    <div className="timing">
                        <div className="current">
                            {formatDuration(0)}
                        </div>
                        <div className="duration">
                            {formatDuration(0)}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div
                id="player"
                className={classNames({'with-controls': withControls})}
            >
                <div className="player-sticky">
                    <div className="notifiable">
                        {info}
                        <PlayerNotification
                            alterationsResponse={
                                responseOfSendPlayerCommandsSafe
                            }
                            playerErrors={playerErrors}
                        />
                        {serverLost}
                    </div>
                </div>
                <CSSTransitionLazy
                    in={withControls}
                    classNames="expand"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                    enter={animationsEnabled}
                    exit={animationsEnabled}
                >
                    <div className="controls">
                        <ManageButton
                            responseOfManage={responseOfSendPlayerCommandsSafe.restart}
                            onClick={() =>
                                    this.props.sendPlayerCommand('restart')
                            }
                            disabled={controlDisabled}
                            icon="step-backward"
                        />
                        <ManageButton
                            responseOfManage={responseOfSendPlayerCommandsSafe.rewind}
                            onClick={() =>
                                    this.props.sendPlayerCommand('rewind')
                            }
                            disabled={controlDisabled}
                            icon="backward"
                        />
                        <ManageButton
                            responseOfManage={
                                playerStatus.paused ?
                                    responseOfSendPlayerCommandsSafe.resume :
                                    responseOfSendPlayerCommandsSafe.pause
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
                            icon={
                                isPlaying ?
                                    (playerStatus.paused ? 'play' : 'pause') :
                                    'stop'
                            }
                        />
                        <ManageButton
                            responseOfManage={
                                responseOfSendPlayerCommandsSafe.fast_forward
                            }
                            onClick={() =>
                                    this.props.sendPlayerCommand('fast_forward')
                            }
                            disabled={controlDisabled}
                            icon="forward"
                        />
                        <ManageButton
                            responseOfManage={responseOfSendPlayerCommandsSafe.skip}
                            onClick={() =>
                                    this.props.sendPlayerCommand('skip', true)
                            }
                            disabled={controlDisabled}
                            icon="step-forward"
                        />
                    </div>
                </CSSTransitionLazy>
                <progress
                    className="progressbar"
                    max="100"
                    value={progress}
                >
                    <div className="bar">
                        <div
                            className="value"
                            style={{width: `${progress}%`}}
                        >
                        </div>
                    </div>
                </progress>
            </div>
        )
    }
}

const ServerLost = () => (
    <div className="notified">
        <div className="notification danger">
            <div className="message">
                Unable to get status from server
            </div>
            <div className="animation pending">
                <span className="point">·</span>
                <span className="point">·</span>
                <span className="point">·</span>
            </div>
        </div>
    </div>
)

const mapStateToProps = (state) => ({
    user: state.authenticatedUser,
    playerStatusState: state.playlist.playerStatus,
    playerErrorsState: state.playlist.digest.playerErrors,
    responseOfSendPlayerCommands: state.alterationsResponse.multiple.sendPlayerCommands,
})

Player = withNavigate(connect(
    mapStateToProps,
    {
        sendPlayerCommand,
    }
)(Player))

export default Player
