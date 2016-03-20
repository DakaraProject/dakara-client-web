var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var utils = require('../dakara-utils');

var Player = React.createClass({
    getInitialState: function() {
        return {pauseCmd: null, skip: -1, notificationMessage: null};
    },

    clearNotification: function() {
        this.setState({notificationMessage: null});
    },

    displayNotification: function(message){
        this.setState({notificationMessage: message});
        setTimeout(this.clearNotification,2000);
    },

    handlePlayPause: function(e){
        if (this.props.playerStatus.playlist_entry){
            var pause = !this.props.playerStatus.paused;
            this.setState({pauseCmd: pause});
            this.props.sendPlayerCommand({"pause": pause}, this.displayNotification);
        }
    },

    handleSkip: function(e){
        if (this.props.playerStatus.playlist_entry){
            this.props.sendPlayerCommand({"skip": true}, this.displayNotification);
            this.setState({pauseCmd: null, skip: this.props.playerStatus.playlist_entry.id});
        }
    },

    render: function() {
        var playerStatus = this.props.playerStatus;
        var songName;
        var playIcon = "fa fa-";
        var playingId;
        var duration;
        var progress;
        if (playerStatus.playlist_entry){
            songName = playerStatus.playlist_entry.song.title;
            duration = playerStatus.playlist_entry.song.duration;

            progress = playerStatus.timing * 100 / duration; 

            playingId = playerStatus.playlist_entry.id;
            playIcon += playerStatus.paused ? "play" : "pause";
        } else {
            playIcon += "stop";
            progress = 0;
            duration = 0;
        }

        var progressStyle = { width: progress + "%"};

        var waitingPause = false;
        if (this.state.pauseCmd != null) {
            waitingPause = (this.state.pauseCmd != playerStatus.paused);
        }
        var waitingSkip = (this.state.skip == playingId);

        var playPausebtn;
        if (waitingPause) {
            playPausebtn = <img src="/static/pending.gif"/>
        } else {
            playPausebtn = <i className={playIcon}></i>
        }

        var skipBtn;
        if (waitingSkip) {
            skipBtn = <img src="/static/pending.gif"/>
        } else {
            skipBtn = <i className="fa fa-step-forward"></i>
        }

        var notificationMessage;
        if(this.state.notificationMessage != null){
            notificationMessage = <div className="notification danger">{this.state.notificationMessage}</div>   
        }

        return (
        <div id="player">
            <div className="top">
                <div className="controls">
                    <div className={"play-pause control primary" + (playerStatus.playlist_entry && !waitingPause ? "" : " disabled")} onClick={this.handlePlayPause}>
                        {playPausebtn} 
                    </div>
                    <div className={"skip control primary" + (playerStatus.playlist_entry && !waitingSkip ? "" : " disabled")} onClick={this.handleSkip}>
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
                        {notificationMessage}
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
