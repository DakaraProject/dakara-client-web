import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { browserHistory } from 'react-router'
import utils from '../utils'
import SongDisplay from './LibraryEntrySongDisplay'

export default class PlaylistEntry extends Component {
    handleSearch = () => {
        const song = this.props.entry.song
        const newSearch = "title:\"\"" + song.title + "\"\""
        browserHistory.push({
            pathname: "/library/song",
            query: {
                search: newSearch,
                expanded: song.id
            }})
    }

    render() {
        let message
        let className = "playlist-entry listing-entry library-entry library-entry-song hoverizable"
        if(this.props.notification){
            message = <div className="notified">
                        <div className={"notification message " + this.props.notification.type}>
                            {this.props.notification.message}
                        </div>
                      </div>

            className += " delayed"
        }

        return (
            <li className={className}>
                <div className="library-entry-song-compact notifiable">
                    <SongDisplay
                        song={this.props.entry.song}
                        handleClick={this.handleSearch}
                    />
                    <div className="playlist-info">
                        <div className="queueing">
                            <span className="icon">
                                <i className="fa fa-clock-o"></i>
                            </span>
                            {utils.formatHourTime(this.props.timeOfPlay)}
                        </div>
                    </div>
                    <div className="controls">
                        <button
                            className="control warning"
                            onClick={() => this.props.removeEntry(this.props.entry.id)}
                        >
                            <span className="icon">
                                <i className="fa fa-times"></i>
                            </span>
                        </button>
                    </div>
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {message}
                    </ReactCSSTransitionGroup>
                </div>
            </li>
        )
    }
}
