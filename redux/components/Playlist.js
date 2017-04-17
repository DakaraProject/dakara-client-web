import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import utils from '../utils'
import PlaylistEntry from './PlaylistEntry'

export default class Playlist extends Component {
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
        let playlistContent
        let next

        // compute time remaing for currently playing song
        let remainingTime = 0
        const playerStatus = this.props.playerStatus.data.status
        if (playerStatus.playlist_entry) {
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing
        }

        //compute time when each song is going to be played
        const timeOfPlay = {}
        for(let entry of list){
            timeOfPlay[entry.id] = currentTime + remainingTime * 1000
            remainingTime += +(entry.song.duration)
        }
        const playListEndTime = currentTime + remainingTime * 1000

        /**
         * Display entries when playlist is not collapsed
         */

        if (!this.props.playlist.collapsed){
            const removeEntry = this.props.removeEntryFromPlaylist
            const notifications = this.props.playlist.notifications
            const playlistEntries = list.map( entry => (
                        <PlaylistEntry
                            key={entry.id}
                            entry={entry}
                            timeOfPlay={timeOfPlay[entry.id]}
                            removeEntry={removeEntry}
                            notification={notifications[entry.id]}
                        />
            ))

            playlistContent = (
                <ReactCSSTransitionGroup
                    component="ul"
                    id="playlist-entries"
                    className="listing"
                    transitionName="add-remove"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={650}
                >
                    {playlistEntries}
                </ReactCSSTransitionGroup>
                )
        }


        /**
         * If there is at least one song in playlist
         * display the next song in taskbar
         */

        if (list[0]){
            next = (
                <div className="info-item">
                    <span className="stat">Next</span>
                    <span className="description">{list[0].song.title}</span>
                </div>
            )
        }

        /**
         * Display playlist en time
         * when playlist is not empty
         */

        let endingInfo
        if (list.length != 0 || playerStatus.playlist_entry) {
            endingInfo = (
                <div className="info-item">
                    <span className="stat">{utils.formatHourTime(playListEndTime)}</span>
                    <span className="description">Ending<br/>time</span>
                </div>
                )
        }

        /**
         * Playlist size
         */

        let playlistSize = this.props.playlist.entries.data.count

        return (
        <div id="playlist">
            <ReactCSSTransitionGroup
                component="div"
                className="playlist-collapse-content"
                transitionName="collapse"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={150}
            >
                {playlistContent}
            </ReactCSSTransitionGroup>
            <div className="info" onClick={this.props.toogleCollapsedPlaylist}>
                <div className="info-item">
                    <span className="stat">{playlistSize}</span>
                    <span className="description">
                        song{playlistSize == 1? '': 's'}
                        <br/>
                        in playlist
                    </span>
                </div>
                {next}
                {endingInfo}
            </div>
        </div>
        )
    }
}
