import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import { parse, stringify } from 'query-string'
import PropTypes from 'prop-types'
import utils from 'utils'
import { addSongToPlaylist } from 'actions'
import Song from 'components/song/Song'
import SongEntryExpanded from './EntryExpanded'
import UserWidget from 'components/generics/UserWidget'
import { IsPlaylistUser } from 'components/permissions/Playlist'

class SongEntry extends Component {
    /**
     * Toogle expanded view of song
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
         * Notification message
         */

        let notification
        if (this.props.notification){
            const notificationClass = classNames(
                'notification',
                'message',
                this.props.notification.type
            )

            notification = (
                <div className="notified">
                    <div className={notificationClass}>
                        {this.props.notification.message}
                    </div>
                </div>
            )
        }

        /**
         * Playlist info
         * Box displaying time of play or currently playing status
         */

        let playlistInfoDiv
        if (playlistInfo) {
            let playQueueInfo
            if (playlistInfo.isPlaying) {
                playQueueInfo = (
                    <div className="playing">
                        <span className="icon">
                            <i className="fa fa-play"></i>
                        </span>
                    </div>
                )
            } else {
                playQueueInfo = (
                    <div className="queueing">
                        <span className="icon">
                            <i className="fa fa-clock-o"></i>
                        </span>
                        {utils.formatHourTime(playlistInfo.timeOfPlay)}
                    </div>
                )
            }

            playlistInfoDiv = (
                        <div className="playlist-info">
                            <UserWidget
                                className="owner"
                                user={playlistInfo.owner}
                            />
                            {playQueueInfo}
                        </div>
                    )
        }

        /**
         * Expanded details
         * block containing additional info on song
         * only displayed when song is expanded
         */

        let SongExpanded
        if (expanded){
            SongExpanded = (
                    <SongEntryExpanded
                        song={this.props.song}
                        location={location}
                    />)
        }

        return (
                <li className="library-entry listing-entry library-entry-song">
                    <div className="library-entry-song-compact hoverizable notifiable">
                        <Song
                            song={song}
                            query={query}
                            noArtistWork={expanded}
                            noTag={expanded}
                            handleClick={() => expanded ? this.setExpanded(null) : this.setExpanded(song.id)}
                        />

                        <ReactCSSTransitionGroup
                            component="div"
                            transitionName="playlist-info"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={150}
                        >
                            {playlistInfoDiv}
                        </ReactCSSTransitionGroup>

                        <div
                            className="controls"
                            id={`song-${this.props.song.id}`}
                        >
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
                        </div>

                        <ReactCSSTransitionGroup
                            transitionName="notified"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={150}
                        >
                            {notification}
                        </ReactCSSTransitionGroup>
                    </div>
                    <ReactCSSTransitionGroup
                        component="div"
                        className='library-entry-song-expanded-container'
                        transitionName="expand-view"
                        transitionEnterTimeout={600}
                        transitionLeaveTimeout={300}
                    >
                        {SongExpanded}
                    </ReactCSSTransitionGroup>
                </li>
        )
    }
}

SongEntry.contextTypes = {
    router: PropTypes.shape({
        history: PropTypes.object.isRequired
    })
}

const mapStateToProps = (state, ownProps) => ({
    query: state.library.song.data.query,
    notification: state.library.songListNotifications[ownProps.song.id]
})

SongEntry = withRouter(connect(
    mapStateToProps,
    { addSongToPlaylist }
)(SongEntry))

export default SongEntry
