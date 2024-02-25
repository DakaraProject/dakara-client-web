import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { loadPlaylist, loadPlaylistPlayed } from 'actions/playlist'
import PlaylistEntryMinimal from 'components/generics/PlaylistEntryMinimal'
import { Status } from 'reducers/alterationsResponse'
import {
    karaokeStatePropType,
    playerStatusStatePropType,
    playlistEntriesStatePropType
} from 'reducers/playlist'
import { params } from 'utils'

dayjs.extend(relativeTime)

class PlaylistInfoBar extends Component {
    static propTypes = {
        loadPlaylist: PropTypes.func.isRequired,
        loadPlaylistPlayed: PropTypes.func.isRequired,
        karaokeState: karaokeStatePropType.isRequired,
        playerStatusState: playerStatusStatePropType.isRequired,
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
    }

    pollPlaylist = () => {
        if (this.props.playlistEntriesState.status !== Status.pending) {
            this.props.loadPlaylist()
        }
        this.timeout = setTimeout(this.pollPlaylist, params.pollInterval)
    }

    componentDidMount() {
        // start polling server
        // this.pollPlaylist()
        this.props.loadPlaylistPlayed()
    }

    componentWillUnmount() {
        // Stop polling server
        clearTimeout(this.timeout)
    }

    render() {
        const {
            playlistEntries,
            date_end: dateEnd
        } = this.props.playlistEntriesState.data
        const { data: playerStatus } = this.props.playerStatusState
        const { data: karaoke } = this.props.karaokeState
        const { date_stop: dateStop } = karaoke

        /**
         * Next element in playlist
         */

        const nextPlaylistEntry = playlistEntries[0]
        let nextEntryWidget
        if (nextPlaylistEntry) {
            nextEntryWidget = (
                <div className="item next-entry">
                    <div className="emphasis">Next</div>
                    <div className="text">
                        <PlaylistEntryMinimal playlistEntry={nextPlaylistEntry}/>
                    </div>
                </div>
            )
        }

        /**
         * Playlist size
         */

        const count = playlistEntries.length
        const amountWidget = (
                <div className="item amount">
                    <div className="emphasis">{count}</div>
                    <div className="text">
                        <div className="line">
                            song{count === 1 ? '' : 's'} in playlist
                        </div>
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
                <div className="item date-end">
                    <div className="text">
                        <div className="line">playlist end</div>
                    </div>
                    <div className="emphasis">{playlistEndDate.format('HH:mm')}</div>
                </div>
            )
        // only karaoke date end
        } else if (!playlistEndDate && karaokeEndDate) {
            if (karaokeEndDate.isAfter()) {
                dateEndWidget = (
                    <div className="item">
                        <div className="text">
                            <div className="line">karaoke end</div>
                            <div className="line detail">
                                {dayjs().to(karaokeEndDate, true)} remaining
                            </div>
                        </div>
                        <div className="emphasis">{karaokeEndDate.format('HH:mm')}</div>
                    </div>
                )
            }
        // both playlist date end and karaoke date end
        } else if (playlistEndDate && karaokeEndDate) {
            // karaoke date end is after playlist date end
            if (karaokeEndDate.isAfter(playlistEndDate)) {
                dateEndWidget = (
                    <div className="item">
                        <div className="text">
                            <div className="line">karaoke end</div>
                            <div className="line detail">
                                {playlistEndDate.to(karaokeEndDate, true)} remaining
                            </div>
                        </div>
                        <div className="emphasis">{karaokeEndDate.format('HH:mm')}</div>
                    </div>
                )
            // playlist date end is after karaoke date end
            } else {
                dateEndWidget = (
                    <div className="item">
                        <div className="text">
                            <div className="line">playlist end</div>
                            <div className="line detail">
                                playlist exceeds karaoke end time
                            </div>
                        </div>
                        <div className="emphasis">
                            {playlistEndDate.format('HH:mm')}
                        </div>
                    </div>
                )
            }
        }

        return (
            <Link
                id="playlist-info-bar"
                to="/playlist"
            >
                {nextEntryWidget}
                {amountWidget}
                {dateEndWidget}
            </Link>
        )
    }
}


const mapStateToProps = (state) => ({
    karaokeState: state.playlist.karaoke,
    playerStatusState: state.playlist.playerStatus,
    playlistEntriesState: state.playlist.entries,
})

PlaylistInfoBar = connect(
    mapStateToProps,
    {
        loadPlaylist,
        loadPlaylistPlayed,
    }
)(PlaylistInfoBar)

export default PlaylistInfoBar
