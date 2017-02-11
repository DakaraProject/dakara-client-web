import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import utils from '../dakara-utils';
import SongDisplay from './SongDisplay';

export default class SongLibraryEntry extends React.Component {
    state = {notification: null}

    handleExpand = (expand) => {
        this.props.setExpandedId(expand ? this.props.song.id : null);
    }

    clearNotification = () => {
        this.setState({notification: null});
    }

    handleReponse = (status) =>{
        if (status) {
            this.setState({
                notification: {
                    message: "Successfuly added!",
                    type: "success"
                }
            });
            setTimeout(this.clearNotification, 2000);
        } else {
            this.setState({
                notification: {
                    message: "Error attempting to add song to playlist",
                    type: "danger"
                }
            });
            setTimeout(this.clearNotification, 5000);
        }
    }

    handleAdd = () => {
        this.setState({
            notification: {
                message: "Adding...",
                type: "success"
            }
        });
        setTimeout(this.clearSuccess,2000);
        var songId = this.props.song.id;
        this.props.addToPlaylist(songId, this.handleReponse);
    }

    render() {
        var message;
        if(this.state.notification != null){
            message = <div className="notified"><div className={"notification " + this.state.notification.type}>{this.state.notification.message}</div></div>
        }
        var timeOfPlay;
        if (this.props.isPlaying) {
            timeOfPlay = (
                <div className="playlist-info-content" key="playing">
                    <div className="playing">
                        <i className="fa fa-play"></i>
                    </div>
                </div>
            );
        } else if (this.props.timeOfPlay) {
            timeOfPlay = (
                <div className="playlist-info-content" key="queueing">
                    <div className="play-time">
                        <i className="fa fa-clock-o"></i>
                        {utils.formatHourTime(this.props.timeOfPlay)}
                    </div>
                </div>
            );
        }

        return (
                <li className="library-entry listing-entry">
                    <SongDisplay
                        song={this.props.song}
                        query={this.props.query}
                        handleExpand={this.handleExpand}
                        expanded={this.props.expanded}
                    />
                    <ReactCSSTransitionGroup
                        component="div"
                        className="playlist-info"
                        transitionName="playlist-info"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {timeOfPlay}
                    </ReactCSSTransitionGroup>
                    <div className="controls" id={"song-" + this.props.song.id}>
                        <div className="add control primary" onClick={this.handleAdd}>
                            <i className="fa fa-plus"></i>
                        </div>
                    </div>
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {message}
                    </ReactCSSTransitionGroup>
                </li>
        );
    }
}
