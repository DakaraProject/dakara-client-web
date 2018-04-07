import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { parse, stringify } from 'query-string'
import PropTypes from 'prop-types'
import { addSongToPlaylist } from 'actions/playlistApp'
import { clearSongListNotification } from 'actions/library'
import Song from 'components/song/Song'
import SongEntryExpanded from './EntryExpanded'
import { IsPlaylistUser, KaraStatusIsNotStopped } from 'components/permissions/Playlist'
import Notification from 'components/generics/Notification'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import DisabledFeedback from 'components/song/DisabledFeedback'
import { songPropType } from 'serverPropTypes/library'
import { alterationStatusPropType } from 'reducers/alterationsStatus'

class SongEntry extends Component {
    static propTypes = {
        song: songPropType.isRequired,
        location: PropTypes.object.isRequired,
        query: PropTypes.object,
        playlistInfo: PropTypes.object,
        addSongStatus: alterationStatusPropType,
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
        const { location, song, query, playlistInfo } = this.props
        const queryObj = parse(location.search)
        const expanded = queryObj.expanded == song.id

        /**
         * Play queue info
         */

        let playQueueInfo
        if (playlistInfo) {
            playQueueInfo = (
                <CSSTransition
                    classNames="playlist-info"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    <PlayQueueInfo {...playlistInfo}/>
                </CSSTransition>
            )
        }

        return (
                <li className="library-entry listing-entry library-entry-song">
                    <div className="library-entry-song-compact hoverizable notifiable">
                        <DisabledFeedback tags={song.tags}/>
                        <Song
                            song={song}
                            query={query}
                            noArtistWork={expanded}
                            noTag={expanded}
                            handleClick={() => expanded ? this.setExpanded(null) : this.setExpanded(song.id)}
                        />
                        <TransitionGroup>
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
                            alterationStatus={this.props.addSongStatus}
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
    addSongStatus: state.alterationsStatus.addSongToPlaylist ?
        state.alterationsStatus.addSongToPlaylist[ownProps.song.id] : null,
})

SongEntry = withRouter(connect(
    mapStateToProps,
    {
        addSongToPlaylist,
        clearSongListNotification
    }
)(SongEntry))

export default SongEntry
