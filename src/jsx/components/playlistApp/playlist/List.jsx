import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withRouter } from 'react-router-dom'
import { formatHourTime, params } from 'utils'
import { loadPlaylist, loadPlaylistPlayed } from 'actions/playlist'
import { removeEntryFromPlaylist, clearPlaylistEntryNotification } from 'actions/playlist'
import PlaylistEntry from './Entry'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { playlistDigestPropType } from 'reducers/playlist'
import { alterationStatusPropType, Status } from 'reducers/alterationsStatus'

class Playlist extends Component {
    static propTypes = {
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        playlistDigest: playlistDigestPropType.isRequired,
        removeEntryStatus: alterationStatusPropType,
        loadPlaylist: PropTypes.func.isRequired,
        loadPlaylistPlayed: PropTypes.func.isRequired,
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
        if (this.props.playlistEntriesState.status !== Status.pending) {
            this.props.loadPlaylist()
        }
        this.timeout = setTimeout(this.pollPlaylist, params.pollInterval)
    }

    componentWillMount() {
        // start polling server
        this.pollPlaylist()
        this.props.loadPlaylistPlayed()
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
        const { playlistEntries, count } = this.props.playlistEntriesState.data

        // compute time remaing for currently playing song
        let remainingTime = 0
        const playerStatus = this.props.playlistDigest.data.player_status
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
    playlistDigest: state.playlist.digest,
    playlistEntriesState: state.playlist.entries,
    removeEntryStatus: state.alterationsStatus.removeEntryFromPlaylist,
})

Playlist = withRouter(connect(
    mapStateToProps,
    {
        loadPlaylist,
        loadPlaylistPlayed,
        removeEntryFromPlaylist,
        clearPlaylistEntryNotification
    }
)(Playlist))

export default Playlist
