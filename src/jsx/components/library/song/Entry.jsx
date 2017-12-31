import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { browserHistory } from 'react-router'
import utils from 'utils'
import { connect } from 'react-redux'
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
        const query = location.query
        if (expanded) {
            query.expanded = expanded
        } else {
            // Remove param from url
            delete query.expanded
        }
        browserHistory.push({pathname: location.pathname, query})
    }

    render() {
        const { location, song, query, playlistInfo } = this.props
        const expanded = location.query.expanded == song.id

        /**
         * Notification message
         */

        let notification
        if (this.props.notification){
            notification = (
                <div className="notified">
                    <div className={"notification message " + this.props.notification.type}>
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

        let songExpandedDetails
        if (expanded){
            songExpandedDetails = (
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
                            expanded={expanded}
                            handleClick={() => expanded ? this.setExpanded(null) : this.setExpanded(song.id)}
                        />

                        <ReactCSSTransitionGroup
                            component="div"
                            className="playlist-info-container"
                            transitionName="playlist-info"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={150}
                        >
                            {playlistInfoDiv}
                        </ReactCSSTransitionGroup>

                        <div className="controls" id={"song-" + this.props.song.id}>
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
                        {songExpandedDetails}
                    </ReactCSSTransitionGroup>
                </li>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    query: state.library.song.data.query,
    notification: state.library.songListNotifications[ownProps.song.id]
})

SongEntry = connect(
    mapStateToProps,
    { addSongToPlaylist }
)(SongEntry)

export default SongEntry
