import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { formatDuration, formatTime, params } from 'utils'
import Song from 'components/song/Song'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistManagerOrOwner } from 'components/permissions/Playlist'
import { loadPlayerDigest, sendPlayerCommands } from 'actions/player'
import Playlist from './playlist/List'
import PlayerNotification from './Notification'
import { playerDigestPropType, playerCommandsPropType } from 'reducers/player'
import ManageButton from './ManageButton'

class Player extends Component {
    static propTypes = {
        playerDigest: playerDigestPropType.isRequired,
        commands: playerCommandsPropType.isRequired,
        loadPlayerDigest: PropTypes.func.isRequired,
        sendPlayerCommands: PropTypes.func.isRequired,
    }

    pollPlayerDigest = () => {
        if (!this.props.playerDigest.isFetching) {
            this.props.loadPlayerDigest()
        }
        this.timeout = setTimeout(this.pollPlayerDigest, params.pollInterval)
    }

    componentWillMount() {
        // start polling server
        this.pollPlayerDigest()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { status: playerStatus, manage: playerCommand, errors: playerErrors } = this.props.playerDigest.data
        const { fetchError } = this.props.playerDigest
        const isPlaying = !!playerStatus.playlist_entry
        const controlDisabled = !isPlaying || fetchError
        const commandPauseStatus = this.props.commands.pause.status
        const commandSkipStatus = this.props.commands.skip.status

        /**
         * Song display if any song is currently playing
         */

        let song
        let playlistEntryOwner
        let duration
        let progress
        if (isPlaying){
            song = (
                    <Song
                        song={playerStatus.playlist_entry.song}
                        noDuration
                        noTag
                        />
                )

            playlistEntryOwner = (
                    <UserWidget
                        user={playerStatus.playlist_entry.owner}
                        className="playlist-entry-owner"
                    />
                )

            duration = playerStatus.playlist_entry.song.duration
            progress = Math.min(playerStatus.timing * 100 / duration, 100)
        } else {
            progress = 0
            duration = 0
        }

        /**
         * Progress bar
         */

        let progressStyle = {width: `${progress}%`}

        return (
            <div className="box">
                <div id="player">
                    <div className="display-area">
                        <div className="controls">
                            <IsPlaylistManagerOrOwner
                                object={playerStatus.playlist_entry}
                                disable
                            >
                                <ManageButton
                                    manageStatus={commandPauseStatus}
                                    onClick={() => {
                                        this.props.sendPlayerCommands({pause: !playerCommand.pause})
                                    }}
                                    disabled={controlDisabled}
                                    icon={playerCommand.pause ? 'pause' : 'play'}
                                    iconDisabled="stop"
                                />
                            </IsPlaylistManagerOrOwner>
                            <IsPlaylistManagerOrOwner
                                object={playerStatus.playlist_entry}
                                disable
                            >
                                <ManageButton
                                    manageStatus={commandSkipStatus}
                                    onClick={() => this.props.sendPlayerCommands({skip: true})}
                                    disabled={controlDisabled}
                                    icon="step-forward"
                                />
                            </IsPlaylistManagerOrOwner>
                        </div>
                        <div className="song-container notifiable">
                            {song}
                            {playlistEntryOwner}
                            <div className="song-timing">
                                <div className="current">
                                    {formatTime(playerStatus.timing)}
                                </div>
                                <div className="duration">
                                    {formatDuration(duration)}
                                </div>
                            </div>
                            <CSSTransitionLazy
                                in={fetchError}
                                classNames="notified"
                                timeout={{
                                    enter: 300,
                                    exit: 150
                                }}
                            >
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
                            </CSSTransitionLazy>
                            <PlayerNotification
                                alterationStatuses={[
                                    this.props.commands.pause,
                                    this.props.commands.skip
                                ]}
                                playerErrors={playerErrors}
                            />
                        </div>
                    </div>
                    <div className="progressbar">
                        <div className="progress" style={progressStyle}></div>
                    </div>
                </div>
                <Playlist/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playerDigest: state.player.digest,
    commands: state.player.commands,
})

Player = withRouter(connect(
    mapStateToProps,
    {
        loadPlayerDigest,
        sendPlayerCommands,
    }
)(Player))

export default Player
