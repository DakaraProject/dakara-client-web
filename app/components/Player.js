var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var Player = React.createClass({
    getInitialState: function() {
        return {notifications: []};
    },

    clearNotification: function() {
        var newNotifications = this.state.notifications;
        newNotifications.shift();
        this.setState({notifications: newNotifications});
        if (newNotifications.length > 0) {
            setTimeout(this.clearNotification, newNotifications[0].timeout);
        }
    },

    addNotification: function(message, type, timeout){
        var newNotifications = this.state.notifications.concat({
                id : Math.floor((Math.random() * 100000)),
                message: message,
                type: type,
                timeout: timeout
            });

        this.setState({
            notifications: newNotifications
        });
        if (newNotifications.length == 1) {
            setTimeout(this.clearNotification, timeout);
        }
    },

    handleReponse: function(status, cmd){
        var cmdString;
        if (cmd.pause != null){
            if (cmd.pause){
                cmdString = "pause"; 
            } else {
                cmdString = "unpause"; 
            }
        } else if (cmd.skip != null){
            cmdString = "skip";
        }
        if (status) {
            if (cmd.skip){
                this.addNotification("Skipped!", "success", 2000);
            }
        } else {
            this.addNotification("Error attempting to " + cmdString, "danger", 5000);
        }
    },

    handlePlayPause: function(e){
        if (this.props.playerStatus.playlist_entry){
            var pause = !this.props.userCmd.pause;
            this.props.sendPlayerCommand({"pause": pause}, this.handleReponse);
        }
    },

    handleSkip: function(e){
        if (this.props.playerStatus.playlist_entry){
            this.props.sendPlayerCommand({"skip": true}, this.handleReponse);
        }
    },

    render: function() {
        var playerStatus = this.props.playerStatus;
        var songName;
        var playIcon = "fa fa-";
        var duration;
        var progress;
        if (playerStatus.playlist_entry){
            songName = playerStatus.playlist_entry.song.title;
            duration = playerStatus.playlist_entry.song.duration;

            progress = playerStatus.timing * 100 / duration; 

            playIcon += this.props.userCmd.pause ? "play" : "pause";
        } else {
            playIcon += "stop";
            progress = 0;
            duration = 0;
        }

        var progressStyle = { width: progress + "%"};

        var playPausebtn = <i className={playIcon}></i>

        var skipBtn = <i className="fa fa-step-forward"></i>

        var message;
        if(this.state.notifications.length > 0){
            message = <div key={this.state.notifications[0].id} className="notified"><div className={"notification " + this.state.notifications[0].type}>{this.state.notifications[0].message}</div></div>
        }

        return (
        <div id="player">
            <div className="top">
                <div className="controls">
                    <div className={"play-pause control primary" + (playerStatus.playlist_entry ? "" : " disabled")} onClick={this.handlePlayPause}>
                        {playPausebtn} 
                    </div>
                    <div className={"skip control primary" + (playerStatus.playlist_entry ? "" : " disabled")} onClick={this.handleSkip}>
                        {skipBtn}
                    </div>
                </div>
                <div className="details">
                    <div className="data">
                        <span className="title">{songName}</span>
                    </div>
                    <div className="status">
                        <div id="playlist-current-timing" className="current">{utils.formatTime(playerStatus.timing)}</div>
                        <div id="playlist-total-timing" className="duration">{utils.formatTime(duration)}</div>
                    </div>
                    <ReactCSSTransitionGroup transitionName="notified" transitionEnterTimeout={300} transitionLeaveTimeout={150}>
                        {message}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
            <div className="progressbar">
                <div className="progress" style={progressStyle}></div>
            </div>
        </div>
        );

    }
});

module.exports = Player;
