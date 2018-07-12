import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatHourTime, params } from 'utils'
import { loadPlaylist, loadPlaylistPlayed } from 'actions/playlist'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { Status } from 'reducers/alterationsResponse'

class PlaylistInfoBar extends Component {
    static propTypes = {
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        loadPlaylist: PropTypes.func.isRequired,
        loadPlaylistPlayed: PropTypes.func.isRequired,
    }

    pollPlaylist = () => {
        if (this.props.playlistEntriesState.status !== Status.pending) {
            this.props.loadPlaylist()
        }
        this.timeout = setTimeout(this.pollPlaylist, params.pollInterval)
    }

    componentWillMount() {
        this.props.loadPlaylist()
        this.props.loadPlaylistPlayed()
    }

    componentWillUnmount() {
    }

    render() {
        const { playlistEntries, date_end } = this.props.playlistEntriesState.data
        const { playerStatus } = this.props

        /**
         * If there is at least one song in playlist
         * display the next song in info zone
         */

        let next
        const nextPlaylistEntry = playlistEntries[0]
        if (nextPlaylistEntry) {
            next = (
                <div className="item next">
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
        if ((playlistEntries.length != 0 || playerStatus.currentEntry) && date_end) {
            const playlistEndTime = Date.parse(date_end)
            ending = (
                <div className="item ending">
                    <span className="stat">{formatHourTime(playlistEndTime)}</span>
                    <span className="description">ending<br/>time</span>
                </div>
                )
        }

        /**
         * Playlist size
         */

        const count = playlistEntries.length
        const amount = (
                <div className="item amount">
                    <span className="stat">{count}</span>
                    <span className="description">
                        song{count == 1 ? '' : 's'}
                        <br/>
                        in playlist
                    </span>
                </div>
            )


        return (
            <Link
                id="playlist-info-bar"
                to="/playlist"
            >
                {amount}
                {next}
                {ending}
            </Link>
        )
    }
}

const mapStateToProps = (state) => ({
    playerStatus: state.playlist.playerStatus.data,
    playlistEntriesState: state.playlist.entries,
})

PlaylistInfoBar = withRouter(connect(
    mapStateToProps,
    {
        loadPlaylist,
        loadPlaylistPlayed,
    }
)(PlaylistInfoBar))

export default PlaylistInfoBar
