import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { clearAlteration } from 'actions/alterations'
import { addSongToPlaylist } from 'actions/playlist'
import Notification from 'components/generics/Notification'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { withSearchParams } from 'components/generics/Router'
import SongEntryExpanded from 'components/library/song/EntryExpanded'
import { CanAddToPlaylist, IsPlaylistUser} from 'components/permissions/Playlist'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import Song from 'components/song/Song'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { songPropType } from 'serverPropTypes/library'
import {
    playerStatusPropType,
    playlistEntryPropType,
    playlistPlayedEntryPropType
} from 'serverPropTypes/playlist'


class SongEntry extends Component {
    static propTypes = {
        addSongToPlaylist: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        karaokeRemainingSeconds: PropTypes.number,
        playerStatus: playerStatusPropType,
        playlistEntries: PropTypes.arrayOf(
            playlistEntryPropType
        ).isRequired,
        playlistPlayedEntries: PropTypes.arrayOf(
            playlistPlayedEntryPropType
        ).isRequired,
        query: PropTypes.object,
        responseOfAddSong: alterationResponsePropType,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
        song: songPropType.isRequired,
    }

    componentWillUnmount() {
        this.props.clearAlteration('addSongToPlaylist', this.props.song.id)
    }

    /**
     * Toggle expanded view of song
     */
    setExpanded = (expanded) => {
        if (expanded) {
            this.props.searchParams.delete('expanded')
            this.props.searchParams.append('expanded', expanded)
        } else {
            this.props.searchParams.delete('expanded')
        }

        this.props.setSearchParams(this.props.searchParams)
    }

    render() {
        const {
            song,
            query,
            playerStatus,
            karaokeRemainingSeconds
        } = this.props
        const { playlistPlayedEntries, playlistEntries } = this.props
        const expanded = +this.props.searchParams.get('expanded') === song.id

        /**
         * Song is playing info
         */

        let playingInfo
        if (
            playerStatus.playlist_entry &&
            playerStatus.playlist_entry.song.id === song.id
        ) {
            // Player is playing this song
            playingInfo = {
                playlistEntry: playerStatus.playlist_entry
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
                playlistEntry: playlistPlayedEntry,
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
                playlistEntry,
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
                        'library-entry listing-entry library-entry-song',
                        {expanded}
                    )}
                >
                    <div className="library-entry-song-compact hoverizable notifiable">
                        <Song
                            song={song}
                            query={query}
                            noArtistWork={expanded}
                            noTag={expanded}
                            karaokeRemainingSeconds={karaokeRemainingSeconds}
                            handleClick={
                                () => expanded ?
                                    this.setExpanded() :
                                    this.setExpanded(song.id)
                            }
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
                            <CanAddToPlaylist>
                                <IsPlaylistUser>
                                    <button
                                        className="control primary"
                                        onClick={() => {
                                            this.props.addSongToPlaylist(
                                              this.props.song.id
                                            )
                                        }}
                                    >
                                        <span className="icon">
                                            <i className="las la-plus"></i>
                                        </span>
                                    </button>
                                </IsPlaylistUser>
                            </CanAddToPlaylist>
                        </div>
                        <Notification
                            alterationResponse={this.props.responseOfAddSong}
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
                                query={this.props.query}
                            />
                        </div>
                    </CSSTransitionLazy>
                </li>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    query: state.library.song.data.query,
    // eslint-disable-next-line max-len
    responseOfAddSong: state.alterationsResponse.multiple.addSongToPlaylist?.[ownProps.song.id],
    playlistPlayedEntries: state.playlist.playedEntries.data.playlistPlayedEntries,
    playlistEntries: state.playlist.entries.data.playlistEntries,
    playerStatus: state.playlist.digest.data.player_status,
})

SongEntry = withSearchParams(connect(
    mapStateToProps,
    {
        addSongToPlaylist,
        clearAlteration
    }
)(SongEntry))

export default SongEntry
