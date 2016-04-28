var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var LibraryEntry = React.createClass({
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
        if (this.props.timeOfPlay) {
            timeOfPlay = (
                <div className="playlist-info">
                    <div className="play-time">
                        <i className="fa fa-clock-o"></i>
                        {utils.formatHourTime(this.props.timeOfPlay)}
                    </div>
                </div>
            );
        }
   

        return (
                <li>
                    <div className="data">
                        <div className="title">
                            {this.props.song.title}
                        </div>
                        <div className="duration">
                            {utils.formatTime(this.props.song.duration)}
                        </div>
                    </div>
                    {timeOfPlay}
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
