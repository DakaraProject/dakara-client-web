import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router'
import utils from '../utils';
import SongDisplay from './LibraryEntrySongDisplay';

export default class PlaylistEntry extends React.Component {
/*
    state = {notification: null}

    clearNotification = () => {
        this.setState({notification: null});
    }

    static contextTypes = {
        navigator: React.PropTypes.object
    }

    clearNotification = () => {
        this.setState({notification: null});
    }

    handleExpand = (expand) => {
        this.context.navigator.setQuerySongAndExpanded(
            "title:\"\"" + this.props.entry.song.title + "\"\"",
            this.props.entry.song.id
        );
    }

    handleReponse = (status) =>{
        if (status) {
           this.setState({
                notification: {
                    message: "Successfuly removed!",
                    type: "success"
                }
            });
        } else {
            this.setState({
                notification: {
                    message: "Error attempting to remove song from playlist",
                    type: "danger"
                }
            });
            setTimeout(this.clearNotification, 5000);
        }
    }

    handleRemove = (e) =>{
       this.setState({
            notification: {
                message: "Removing...",
                type: "success"
            }
        });
        this.props.removeEntry(this.props.entry.id, this.handleReponse);

    }
*/

    handleSearch = () => {
        const song = this.props.entry.song
        const newSearch = "title:\"\"" + song.title + "\"\"";
        browserHistory.push({
            pathname: "/library/song",
            query: {
                search: newSearch,
                expanded: song.id
            }})
    }

    render() {
        var message;
        var className = "playlist-entry listing-entry listing-entry-song hoverizable";
        if(this.props.notification){
            message = <div className="notified">
                        <div className={"notification " + this.props.notification.type}>
                            {this.props.notification.message}
                        </div>
                      </div>

            className += " delayed";
        }

        return (
            <li className={className}>
                <div className="song-compact">
                    <SongDisplay
                        song={this.props.entry.song}
                        handleClick={this.handleSearch}
                    />
                    <div className="playlist-info">
                        <div className="playlist-info-content">
                            <div className="play-time">
                                <i className="fa fa-clock-o"></i>
                                {utils.formatHourTime(this.props.timeOfPlay)}
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <button
                            className="remove control warning"
                            onClick={() => this.props.removeEntry(this.props.entry.id)}
                        >
                            <i className="fa fa-times"></i>
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
        );
    }
}
