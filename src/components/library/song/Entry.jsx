import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { clearAlteration } from 'actions/alterations'
import { addSongToPlaylist } from 'actions/playlist'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'
import Notification from 'components/generics/Notification'
import SongEntryExpanded from 'components/library/song/EntryExpanded'
import {
    CanAddToPlaylist,
    IsPlaylistManager,
    IsPlaylistUser
} from 'permissions/Playlist'
import PlaylistPositionInfo from 'components/song/PlaylistPositionInfo'
import Song from 'components/song/Song'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { songPropType } from 'serverPropTypes/library'
import { playlistEntryPropType } from 'serverPropTypes/playlist'
import { userPropType } from 'serverPropTypes/users'


class SongEntry extends Component {
    static propTypes = {
        addSongToPlaylist: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        karaokeRemainingSeconds: PropTypes.number,
        playlistEntries: PropTypes.arrayOf(
            playlistEntryPropType
        ).isRequired,
        query: PropTypes.object,
        responseOfAddSong: alterationResponsePropType,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
        song: songPropType.isRequired,
        user: userPropType.isRequired,
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
            karaokeRemainingSeconds,
            query,
            song,
            user,
            playlistEntries,
        } = this.props
        const expanded = +this.props.searchParams.get('expanded') === song.id
        const exceeding = karaokeRemainingSeconds &&
            karaokeRemainingSeconds < song.duration
        const canAdd = !exceeding || IsPlaylistManager.hasPermission(user)

        /**
         * Play queue info
         */

        let playlistPositionInfo
        const entries = playlistEntries.filter(e => e.song.id === song.id)
        if (entries.length > 0) {
            playlistPositionInfo = (
                <CSSTransition
                    classNames="playlist-position-info"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    <PlaylistPositionInfo entries={entries} />
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
                        <div className="extra">
                            <TransitionGroup
                                className="play-queue-info-wrapper"
                            >
                                {playlistPositionInfo}
                            </TransitionGroup>
                            <div
                                className="controls"
                                id={`song-${this.props.song.id}`}
                            >
                                <CanAddToPlaylist>
                                    <IsPlaylistUser>
                                        <button
                                            disabled={!canAdd}
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
                                canAdd={canAdd}
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
    playlistEntries: state.playlist.digest.entries.data.playlistEntries,
    user: state.authenticatedUser,
})

SongEntry = withSearchParams(connect(
    mapStateToProps,
    {
        addSongToPlaylist,
        clearAlteration
    }
)(SongEntry))

export default SongEntry
