import React, { Component } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { params } from 'utils'
import { loadPlaylist, loadPlaylistPlayed } from 'actions/playlist'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { playlistDigestPropType } from 'reducers/playlist'
import { Status } from 'reducers/alterationsResponse'

dayjs.extend(relativeTime)

class PlaylistInfoBar extends Component {
    static propTypes = {
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        playlistDigest: playlistDigestPropType.isRequired,
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
        // start polling server
        this.pollPlaylist()
        this.props.loadPlaylistPlayed()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const { playlistEntries, date_end: dateEnd } = this.props.playlistEntriesState.data
        const playerStatus = this.props.playlistDigest.data.player_status
        const dateStop = this.props.playlistDigest.data.karaoke.date_stop

        /**
         * Playlist size
         */

        const count = playlistEntries.length
        const amount = (
                <div className="item">
                    <div className="value">{count}</div>
                    <div className="description">
                        <div className="line">song{count === 1 ? '' : 's'} in playlist</div>
                    </div>
                </div>
            )

        /**
         * Display karaoke end or playlist end
         *
         * The code is voluntary redundant, as the different cases do not factor
         * well together. At least, the code is easy to understand.
         */

        const playlistEndDate = dateEnd &&
            (count || playerStatus.playlist_entry) ? dayjs(dateEnd) : null
        const karaokeEndDate = dateStop ? dayjs(dateStop) : null

        let dateEndWidget
        // only playlist date end
        if (playlistEndDate && !karaokeEndDate) {
            dateEndWidget = (
                <div className="item reverse">
                    <div className="description">
                        <div className="line">playlist end</div>
                    </div>
                    <div className="value">{playlistEndDate.format('HH:mm')}</div>
                </div>
            )
        // only karaoke date end
        } else if (!playlistEndDate && karaokeEndDate) {
            if (karaokeEndDate.isAfter()) {
                dateEndWidget = (
                    <div className="item reverse">
                        <div className="description">
                            <div className="line">karaoke end</div>
                            <div className="line detail">
                                {dayjs().to(karaokeEndDate, true)} remaining
                            </div>
                        </div>
                        <div className="value">{karaokeEndDate.format('HH:mm')}</div>
                    </div>
                )
            }
        // both playlist date end and karaoke date end
        } else if (playlistEndDate && karaokeEndDate) {
            // karaoke date end is after playlist date end
            if (karaokeEndDate.isAfter(playlistEndDate)) {
                dateEndWidget = (
                    <div className="item reverse">
                        <div className="description">
                            <div className="line">karaoke end</div>
                            <div className="line detail">
                                {playlistEndDate.to(karaokeEndDate, true)} remaining
                            </div>
                        </div>
                        <div className="value">{karaokeEndDate.format('HH:mm')}</div>
                    </div>
                )
            // playlist date end is after karaoke date end
            } else {
                dateEndWidget = (
                    <div className="item reverse">
                        <div className="description">
                            <div className="line">playlist end</div>
                            <div className="line detail">
                                playlist exceeds karaoke end time
                            </div>
                        </div>
                        <div className="value">{playlistEndDate.format('HH:mm')}</div>
                    </div>
                )
            }
        }

        return (
            <Link
                id="playlist-info-bar"
                to="/playlist"
            >
                {amount}
                {dateEndWidget}
            </Link>
        )
    }
}

const mapStateToProps = (state) => ({
    playlistDigest: state.playlist.digest,
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
