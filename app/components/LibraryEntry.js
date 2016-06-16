var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');
var SongDisplay = require('./SongDisplay');

var LibraryEntry = React.createClass({
    handleExpand: function() {
        this.props.setExpandedId(this.props.song.id);
    },

    handleClose: function() {
        this.props.setExpandedId(null);
    },

    getInitialState: function() {
        return {notification: null};
    },
    clearNotification: function() {
        this.setState({notification: null});
    },
    handleReponse: function(status){
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
    },
    handleAdd: function() {
        this.setState({
            notification: {
                message: "Adding...",
                type: "success"
            }
        });
        setTimeout(this.clearSuccess,2000);
        var songId = this.props.song.id;
        this.props.addToPlaylist(songId, this.handleReponse);
    },
    render: function() {
        var message;
        if(this.state.notification != null){
            message = <div className="notified"><div className={"notification " + this.state.notification.type}>{this.state.notification.message}</div></div>
        }
        var timeOfPlay;
        if (this.props.isPlaying) {
            timeOfPlay = (
                <div className="playlist-info-content">
                    <div className="playing">
                        <i className="fa fa-play"></i>
                    </div>
                </div>
            );
        } else if (this.props.timeOfPlay) {
            timeOfPlay = (
                <div className="playlist-info-content">
                    <div className="play-time">
                        <i className="fa fa-clock-o"></i>
                        {utils.formatHourTime(this.props.timeOfPlay)}
                    </div>
                </div>
            );
        }

        return (
                <li>
                    <SongDisplay song={this.props.song} query={this.props.query} handleExpand={this.handleExpand} handleClose={this.handleClose} setSearch={this.props.setSearch} expanded={this.props.expanded}/>
                    <div className="playlist-info">
                        {timeOfPlay}
                    </div>
                    <div className="controls" id={"song-" + this.props.song.id}>
                        <div className="add control primary" onClick={this.handleAdd}>
                            <i className="fa fa-plus"></i>
                        </div>
                    </div>
                    <ReactCSSTransitionGroup transitionName="notified" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                        {message}
                    </ReactCSSTransitionGroup>
                </li>
        );
    }
});

module.exports = LibraryEntry;
