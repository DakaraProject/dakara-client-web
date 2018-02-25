import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withRouter } from 'react-router-dom'
import utils from 'utils'
import { loadPlaylist, toogleCollapsedPlaylist } from 'actions/player'
import { removeEntryFromPlaylist, clearPlaylistEntryNotification } from 'actions/player'
import PlaylistEntry from './Entry'

class Playlist extends Component {
    static propTypes = {
        playlist: PropTypes.shape({
            entries: PropTypes.shape({
                data: PropTypes.shape({
                    results: PropTypes.arrayOf(PropTypes.shape({
                        id: PropTypes.any.isRequired,
                        song: PropTypes.shape({
                            duration: PropTypes.number.isRequired,
                            title: PropTypes.string.isRequired,
                        }).isRequired,
                    }).isRequired).isRequired,
                    count: PropTypes.number.isRequired,
                }),
                isFetching: PropTypes.bool.isRequired,
            }).isRequired,
            collapsed: PropTypes.bool.isRequired,
        }).isRequired,
        playerStatus: PropTypes.shape({
            data: PropTypes.shape({
                status: PropTypes.shape({
                    playlist_entry: PropTypes.shape({
                        song: PropTypes.shape({
                            duration: PropTypes.number.isRequired,
                        }).isRequired,
                    }),
                }).isRequired,
            }).isRequired,
            timing: PropTypes.number,
        }).isRequired,
        removeEntryStatus: PropTypes.object,
        loadPlaylist: PropTypes.func.isRequired,
        toogleCollapsedPlaylist: PropTypes.func.isRequired,
        removeEntryFromPlaylist: PropTypes.func.isRequired,
        clearPlaylistEntryNotification: PropTypes.func.isRequired,
    }

    static defaultProps = {
        removeEntryStatus: {},
    }

    pollPlaylist = () => {
        if (!this.props.playlist.entries.isFetching) {
            this.props.loadPlaylist()
        }
        this.timeout = setTimeout(this.pollPlaylist, utils.params.pollInterval)
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
        const list = this.props.playlist.entries.data.results

        // compute time remaing for currently playing song
        let remainingTime = 0
        const playerStatus = this.props.playerStatus.data.status
        if (playerStatus.playlist_entry) {
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing
        }

        //compute time when each song is going to be played
        const timeOfPlay = {}
        for (let entry of list) {
            timeOfPlay[entry.id] = currentTime + remainingTime * 1000
            remainingTime += +(entry.song.duration)
        }
        const playListEndTime = currentTime + remainingTime * 1000

        /**
         * Display entries when playlist is not collapsed
         */

        const removeEntry = this.props.removeEntryFromPlaylist
        const removeEntryStatus = this.props.removeEntryStatus
        const playlistEntries = list.map( entry => (
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
                {playlistEntries}
            </TransitionGroup>
        )


        /**
         * If there is at least one song in playlist
         * display the next song in info zone
         */

        let next
        if (list[0]){
            next = (
                <div className="item">
                    <span className="stat">Next</span>
                    <span className="description">{list[0].song.title}</span>
                </div>
            )
        }

        /**
         * Display playlist en time
         * when playlist is not empty
         */

        let ending
        if (list.length != 0 || playerStatus.playlist_entry) {
            ending = (
                <div className="item">
                    <span className="stat">{utils.formatHourTime(playListEndTime)}</span>
                    <span className="description">ending<br/>time</span>
                </div>
                )
        }

        /**
         * Playlist size
         */

        const playlistSize = this.props.playlist.entries.data.count
        const amount = (
                <div className="item">
                    <span className="stat">{playlistSize}</span>
                    <span className="description">
                        song{playlistSize == 1? '': 's'}
                        <br/>
                        in playlist
                    </span>
                </div>
            )

        return (
        <div id="playlist">
            <CSSTransitionLazy
                in={!this.props.playlist.collapsed}
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
                onClick={this.props.toogleCollapsedPlaylist}
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
    playerStatus: state.player.status,
    playlist: state.player.playlist,
    removeEntryStatus: state.alterationsStatus.removeEntryFromPlaylist,
})

Playlist = withRouter(connect(
    mapStateToProps,
    {
        loadPlaylist,
        toogleCollapsedPlaylist,
        removeEntryFromPlaylist,
        clearPlaylistEntryNotification
    }
)(Playlist))

export default Playlist
