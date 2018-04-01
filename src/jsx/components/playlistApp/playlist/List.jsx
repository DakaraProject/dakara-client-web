import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withRouter } from 'react-router-dom'
import { formatHourTime, params } from 'utils'
import { loadPlaylist } from 'actions/player'
import { removeEntryFromPlaylist, clearPlaylistEntryNotification } from 'actions/player'
import PlaylistEntry from './Entry'
import { playlistPropType } from 'reducers/playlist'
import { playerDigestPropType } from 'reducers/player'
import { alterationStatusPropType, Status } from 'reducers/alterationsStatus'

class Playlist extends Component {
    static propTypes = {
        playlist: playlistPropType.isRequired,
        playerDigest: playerDigestPropType.isRequired,
        removeEntryStatus: alterationStatusPropType,
        loadPlaylist: PropTypes.func.isRequired,
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        clearPlaylistEntryNotification: PropTypes.func.isRequired,
    }

    static defaultProps = {
        removeEntryStatus: {},
    }

    state = {
        expanded: false,
    }

    togglePlaylist = () => {
        this.setState({expanded: !this.state.expanded})
    }

    pollPlaylist = () => {
        if (this.props.playlist.status !== Status.pending) {
            this.props.loadPlaylist()
        }
        this.timeout = setTimeout(this.pollPlaylist, params.pollInterval)
    }

    componentWillMount() {
        // start polling server
        this.pollPlaylist()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        /**
         * Compute time of play of each song
         */

        const currentTime = new Date().getTime()
        const { playlistEntries, count } = this.props.playlist.data

        // compute time remaing for currently playing song
        let remainingTime = 0
        const playerStatus = this.props.playerDigest.data.player_status
        if (playerStatus.playlist_entry) {
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing
        }

        //compute time when each song is going to be played
        const timeOfPlay = {}
        for (let entry of playlistEntries) {
            timeOfPlay[entry.id] = currentTime + remainingTime * 1000
            remainingTime += +(entry.song.duration)
        }
        const playListEndTime = currentTime + remainingTime * 1000

        /**
         * Display entries when playlist is not collapsed
         */

        const removeEntry = this.props.removeEntryFromPlaylist
        const removeEntryStatus = this.props.removeEntryStatus
        const playlistEntriesComponent = playlistEntries.map( entry => (
            <CSSTransition
                classNames='add-remove'
                timeout={{
                    enter: 300,
                    exit: 650
                }}
                key={entry.id}
            >
                <PlaylistEntry
                    entry={entry}
                    timeOfPlay={timeOfPlay[entry.id]}
                    removeEntry={removeEntry}
                    clearPlaylistEntryNotification={this.props.clearPlaylistEntryNotification}
                    removeEntryStatus={removeEntryStatus[entry.id]}
                />
            </CSSTransition>
        ))

        const playlistContent = (
            <TransitionGroup
                component="ul"
                className="listing playlist-list"
            >
                {playlistEntriesComponent}
            </TransitionGroup>
        )


        /**
         * If there is at least one song in playlist
         * display the next song in info zone
         */

        let next
        const nextPlaylistEntry = playlistEntries[0]
        if (nextPlaylistEntry) {
            next = (
                <div className="item">
                    <span className="stat">Next</span>
                    <span className="description">{nextPlaylistEntry.song.title}</span>
                </div>
            )
        }

        /**
         * Display playlist end time
         * when playlist is not empty
         */

        let ending
        if (playlistEntries.length != 0 || playerStatus.playlist_entry) {
            ending = (
                <div className="item">
                    <span className="stat">{formatHourTime(playListEndTime)}</span>
                    <span className="description">ending<br/>time</span>
                </div>
                )
        }

        /**
         * Playlist size
         */

        const amount = (
                <div className="item">
                    <span className="stat">{count}</span>
                    <span className="description">
                        song{count == 1 ? '' : 's'}
                        <br/>
                        in playlist
                    </span>
                </div>
            )

        return (
        <div id="playlist">
            <CSSTransitionLazy
                in={this.state.expanded}
                classNames="collapse"
                timeout={{
                    enter: 300,
                    exit: 150
                }}
            >
                {playlistContent}
            </CSSTransitionLazy>
            <button
                className="playlist-summary"
                onClick={this.togglePlaylist}
            >
                {amount}
                {next}
                {ending}
            </button>
        </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playerDigest: state.player.digest,
    playlist: state.player.playlist,
    removeEntryStatus: state.alterationsStatus.removeEntryFromPlaylist,
})

Playlist = withRouter(connect(
    mapStateToProps,
    {
        loadPlaylist,
        removeEntryFromPlaylist,
        clearPlaylistEntryNotification
    }
)(Playlist))

export default Playlist
