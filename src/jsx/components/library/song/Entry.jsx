import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { parse, stringify } from 'query-string'
import PropTypes from 'prop-types'
import { addSongToPlaylist } from 'actions/playlist'
import { clearSongListNotification } from 'actions/library'
import Song from 'components/song/Song'
import SongEntryExpanded from './EntryExpanded'
import { IsPlaylistUser, KaraStatusIsNotStopped } from 'components/permissions/Playlist'
import Notification from 'components/generics/Notification'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import { songPropType } from 'serverPropTypes/library'
import { playerStatusPropType } from 'serverPropTypes/playlist'
import { playlistPlayedEntryPropType, playlistEntryPropType } from 'serverPropTypes/playlist'
import { alterationStatusPropType } from 'reducers/alterationsStatus'

class SongEntry extends Component {
    static propTypes = {
        song: songPropType.isRequired,
        location: PropTypes.object.isRequired,
        query: PropTypes.object,
        playlistPlayedEntries: PropTypes.arrayOf(
            playlistPlayedEntryPropType
        ).isRequired,
        playlistEntries: PropTypes.arrayOf(
            playlistEntryPropType
        ).isRequired,
        playerStatus: playerStatusPropType,
        statusAddSong: alterationStatusPropType,
        addSongToPlaylist: PropTypes.func.isRequired,
        clearSongListNotification: PropTypes.func.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.object.isRequired
        })
    }

    componentWillUnmount() {
        this.props.clearSongListNotification(this.props.song.id)
    }

    /**
     * Toggle expanded view of song
     */
    setExpanded = (expanded) => {
        const { location } = this.props
        const queryObj = parse(location.search)

        if (expanded) {
            queryObj.expanded = expanded
        } else {
            // Remove param from url
            delete queryObj.expanded
        }

        this.context.router.history.push({
            pathname: location.pathname,
            search: stringify(queryObj)
        })
    }

    render() {
        const { location, song, query, playerStatus } = this.props
        const { playlistPlayedEntries, playlistEntries } = this.props
        const queryObj = parse(location.search)
        const expanded = queryObj.expanded == song.id

        /**
         * Song is playing info
         */

        let playingInfo
        if (playerStatus.playlist_entry && playerStatus.playlist_entry.song.id === song.id) {
            // Player is playing this song
            playingInfo = {
                owner: playerStatus.playlist_entry.owner
            }
        }

        /**
         * Song previously played info
         */

        const playlistPlayedEntry = playlistPlayedEntries.slice().reverse().find(
                e => (e.song.id === song.id)
                )

        let playedInfo
        if (playlistPlayedEntry) {
            playedInfo = {
                timeOfPlay: Date.parse(playlistPlayedEntry.date_played),
                owner: playlistPlayedEntry.owner,
            }
        }

        /**
         * Song queue info
         */

        const playlistEntry = playlistEntries.find(
                e => (e.song.id === song.id)
                )

        let queueInfo
        if (playlistEntry) {
            queueInfo = {
                timeOfPlay: Date.parse(playlistEntry.date_play),
                owner: playlistEntry.owner,
            }
        }

        /**
         * Play queue info
         */

        let playQueueInfo
        if (playingInfo || playedInfo || queueInfo) {
            playQueueInfo = (
                <CSSTransition
                    classNames="playlist-info"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    <PlayQueueInfo
                        playingInfo={playingInfo}
                        playedInfo={playedInfo}
                        queueInfo={queueInfo}
                    />
                </CSSTransition>
            )
        }

        return (
                <li
                    className={classNames(
                        "library-entry listing-entry library-entry-song",
                        {expanded}
                    )}
                >
                    <div className="library-entry-song-compact hoverizable notifiable">
                        <Song
                            song={song}
                            query={query}
                            noArtistWork={expanded}
                            noTag={expanded}
                            handleClick={() => expanded ? this.setExpanded(null) : this.setExpanded(song.id)}
                        />
                        <TransitionGroup
                            className="play-queue-info-wrapper"
                        >
                            {playQueueInfo}
                        </TransitionGroup>
                        <div
                            className="controls"
                            id={`song-${this.props.song.id}`}
                        >
                            <KaraStatusIsNotStopped>
                                <IsPlaylistUser>
                                    <button
                                        className="control primary"
                                        onClick={() => {
                                            this.props.addSongToPlaylist(this.props.song.id)
                                        }}
                                    >
                                        <span className="icon">
                                            <i className="fa fa-plus"></i>
                                        </span>
                                    </button>
                                </IsPlaylistUser>
                            </KaraStatusIsNotStopped>
                        </div>
                        <Notification
                            alterationStatus={this.props.statusAddSong}
                            pendingMessage="Adding…"
                            successfulMessage="Successfuly added!"
                            failedMessage="Error attempting to add song to playlist"
                        />
                    </div>
                    <CSSTransitionLazy
                        in={expanded}
                        classNames="expand-view"
                        timeout={{
                            enter: 600,
                            exit: 300
                        }}
                    >
                        <div className='library-entry-song-expanded-wrapper'>
                            <SongEntryExpanded
                                song={this.props.song}
                                location={location}
                            />
                        </div>
                    </CSSTransitionLazy>
                </li>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    query: state.library.song.data.query,
    statusAddSong: state.alterationsStatus.addSongToPlaylist ?
        state.alterationsStatus.addSongToPlaylist[ownProps.song.id] : null,
    playlistPlayedEntries: state.playlist.playedEntries.data.playlistPlayedEntries,
    playlistEntries: state.playlist.entries.data.playlistEntries,
    playerStatus: state.playlist.digest.data.player_status,
})

SongEntry = withRouter(connect(
    mapStateToProps,
    {
        addSongToPlaylist,
        clearSongListNotification
    }
)(SongEntry))

export default SongEntry
