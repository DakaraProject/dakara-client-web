var $ = jQuery = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var sprintf = require('sprintf-js').sprintf;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var remaining = seconds % 3600;
    var minsec = sprintf("%02d:%02d", Math.floor(remaining / 60), remaining % 60);
    return (hours == 0 ? '' : (hours + ":")) + minsec;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var LibraryEntry = React.createClass({
    getInitialState: function() {
        return {displayNotification: false};
    },
    clearNotifications: function() {
        this.setState({displayNotification: false});
    },
    handleAdd: function() {
        this.setState({displayNotification: true});
        setTimeout(this.clearNotifications,10000);
        var songId = this.props.song.id;
        this.props.addToPlaylist(songId);
    },
    render: function() {
        var notificationMessage;
        if(this.state.displayNotification){
            notificationMessage = <div>Added !</div>   
        }

        return (
                <li>
                    <div className="data">
                        <div className="title">
                            {this.props.song.title}
                        </div>
                        <div className="duration">
                            {formatTime(this.props.song.duration)}
                        </div>
                    </div>
                    <div className="controls" id={"song-" + this.props.song.id}>
                        <div className="add control-primary" onClick={this.handleAdd}>
                            <i className="fa fa-plus"></i>
                        </div>
                    </div>
                    <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
                        {notificationMessage}
                    </ReactCSSTransitionGroup>
                </li>
        );
    }
});

var Library = React.createClass({
    getInitialState: function() {
        return {libraryEntries: {count: 0, results: []}, search: ""};
    },

    componentDidMount: function() {
        this.refreshEntries(this.props.url + "library/songs/");
    },

    handleNext: function() {
        this.refreshEntries(this.state.libraryEntries.next);
    },

    handlePrevious: function() {
        this.refreshEntries(this.state.libraryEntries.previous);
    },

    handleFirst: function() {
        if (this.state.libraryEntries.previous) {
            this.refreshEntries(this.props.url + "library/songs/?title=" + encodeURIComponent(this.state.search));
        }
    },

    handleLast: function() {
        if (this.state.libraryEntries.next) {
            this.refreshEntries(this.props.url + "library/songs/?page=last&title=" + encodeURIComponent(this.state.search));
        }
    },

    handleSearchChange: function(e) {
        this.setState({search: e.target.value});
    },

    handleSubmit: function(e) {
        e.preventDefault();
        this.handleSearch(e);
    },

    handleSearch: function(e) {
        this.refreshEntries(this.props.url + "library/songs/?title=" + encodeURIComponent(this.state.search));                
    },

    handleClear: function(e) {
        this.setState({search: ''});                
    },

    addToPlaylist: function(songId) {
        $.ajax({
        url: this.props.url + "playlist/",
        dataType: 'json',
        type: 'POST',
        data: {"song": songId},
        success: function(data) {
            this.props.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    refreshEntries: function(url) {
        if (url) {
            $.ajax({
              url: url,
              dataType: 'json',
              cache: false,
              success: function(data) {
                this.setState({libraryEntries: data});
              }.bind(this),
              error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
              }.bind(this)
            });
        }
    },

    render: function() {
        var addToPlaylist = this.addToPlaylist;
        var list = this.state.libraryEntries.results.map(function(entry){
            return (<LibraryEntry key={entry.id} song={entry} addToPlaylist={addToPlaylist}/>);
        });
        var count = this.state.libraryEntries.count;
        var hasNext = this.state.libraryEntries.next;
        var hasPrevious = this.state.libraryEntries.previous;
        return (
        <div>
            <form id="query" onSubmit={this.handleSubmit}>
                <div className="field">
                    <div className="fake-input">
                        <input type="text" value={this.state.search} onChange={this.handleSearchChange} placeholder="What will you sing?"/>
                        <div className="clear" onClick={this.handleClear}>
                            <i className="fa fa-times"></i>
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <div className="search control-primary" onClick={this.handleSearch}>
                        <i className="fa fa-search"></i>
                    </div>
                </div>
            </form>
            <div id="results">
                <ul id="results-listing" className="listing">
                    {list}
                </ul>
            </div>
            <nav id="paginator">
                <div className="controls">
                    <div className={"first control-primary" + (hasPrevious? "" : " disabled")} onClick={this.handleFirst}>
                        <i className="fa fa-angle-double-left"></i>
                    </div>
                    <div className={"previous control-primary" + (hasPrevious? "" : " disabled")} onClick={this.handlePrevious}>
                        <i className="fa fa-angle-left"></i>
                    </div>
                    <div className={"next control-primary" + (hasNext? "" : " disabled")} onClick={this.handleNext}>
                        <i className="fa fa-angle-right"></i>
                    </div>
                    <div className={"last control-primary" + (hasNext? "" : " disabled")} onClick={this.handleLast}>
                        <i className="fa fa-angle-double-right"></i>
                    </div>
                </div>
                <div className="info">
                    <div className="info-item" id="library-amount">
                        <span className="stat">{count}</span>
                        <span className="description">song{count == 1? '': 's'} found</span>
                    </div>
                </div>
            </nav>
        </div>
        );
    }
});




var Player = React.createClass({
    getInitialState: function() {
        return {pauseCmd: null, skip: -1};
    },

    handlePlayPause: function(e){
        if (this.props.playerStatus.playlist_entry){
            var pause = !this.props.playerStatus.paused;
            this.setState({pauseCmd: pause});
            this.props.sendPlayerCommand({"pause": pause});
        }
    },

    handleSkip: function(e){
        if (this.props.playerStatus.playlist_entry){
            this.props.sendPlayerCommand({"skip": true});
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


        return (
        <div id="player">
            <div className="top">
                <div className="controls">
                    <div className={"play-pause control-primary" + (playerStatus.playlist_entry && !waitingPause ? "" : " disabled")} onClick={this.handlePlayPause}>
                        {playPausebtn} 
                    </div>
                    <div className={"skip control-primary" + (playerStatus.playlist_entry && !waitingSkip ? "" : " disabled")} onClick={this.handleSkip}>
                        {skipBtn}
                    </div>
                </div>
                <div id="playlist-current-song" className="details">
                    <span className="title">{songName}</span>
                </div>
                <div className="status">
                    <div id="playlist-current-timing" className="current">{formatTime(playerStatus.timing)}</div>
                    <div id="playlist-total-timing" className="duration">{formatTime(duration)}</div>
                </div>
            </div>
            <div className="progressbar">
                <div className="progress" style={progressStyle}></div>
            </div>
        </div>
        );

    }
});

var PlaylistEntry = React.createClass({
    getInitialState: function() {
        return {displayNotification: false};
    },
    handleRemove: function(e){
        this.setState({displayNotification: true});   
        this.props.removeEntry(this.props.entry.id);
    },

    render: function(){
        var notificationMessage;
        if(this.state.displayNotification){
            notificationMessage = <div>Deleted !</div>   
        }
        return (
            <li>
                <div className="data">
                    <div className="title">
                        {this.props.entry.song.title}
                    </div>
                    <div className="duration">
                        {formatTime(this.props.entry.song.duration)}
                    </div>
                </div>
                <div className="controls">
                    <div className="remove control-danger" onClick={this.handleRemove}>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
                <ReactCSSTransitionGroup transitionName="notification" transitionEnterTimeout={2000}>
                    {notificationMessage}
                </ReactCSSTransitionGroup>
            </li>
        );
    }
});


var Playlist = React.createClass({
    handleCollapse: function() {
        this.setState({collapsed: !this.state.collapsed});
    },
    getInitialState: function() {
        return {collapsed: true};
    },

    render: function() {
        var playingId = this.props.playingId; 
        var list = this.props.entries.results;
        var playlistContent;
        var next;
        var playlistDuration = 0;
        for(entry of list){
            playlistDuration += +(entry.song.duration);
        }

        if (!this.state.collapsed){
            var removeEntry = this.props.removeEntry;
            var playlistEntries = list.map(function(entry) {
                return ( <PlaylistEntry key={entry.id} entry={entry} removeEntry={removeEntry}/> );
            });
            playlistContent = (
                <ul id="entries-listing" className="listing">
                    <ReactCSSTransitionGroup transitionName="transition" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
                        {playlistEntries}
                    </ReactCSSTransitionGroup>
                </ul>
                )
        } 
        if (list[0]){
            next = (
                <div className="info-item">
                    <span className="stat">Next</span>
                    <span className="description">{list[0].song.title}</span>
                </div>
            );
        }
        
        var playlistSize = this.props.entries.count;

        return (
        <div id="entries">
            <ReactCSSTransitionGroup transitionName="collapse" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
                {playlistContent}
            </ReactCSSTransitionGroup>
            <div className="info" onClick={this.handleCollapse}> 
                <div className="info-item">
                    <span className="stat">{playlistSize}</span>
                    <span className="description">song{playlistSize == 1? '': 's'}<br/>in playlist</span>
                </div>
                {next}
                <div className="info-item">
                    <span className="stat">{formatTime(playlistDuration)}</span>
                    <span className="description">in <br/> playlist</span>
                </div>
            </div>
        </div>
        );
    }
});

var PlayerBox = React.createClass({
    getInitialState: function() {
        return {playerStatus: {playlist_entry: null,timing:0}, playlistEntries: {count: 0, results: []}};
    },

    sendPlayerCommand : function(cmd) {
        $.ajax({
        url: this.props.url + "playlist/player/manage/",
        dataType: 'json',
        type: 'PUT',
        data: cmd,
        success: function(data) {
        }.bind(this),
        error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    removeEntry : function(entryId) {
        $.ajax({
        url: this.props.url + "playlist/" + entryId + "/",
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },


    loadStatusFromServer: function() {
        $.ajax({
            url: this.props.url + "playlist/player/status/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({playerStatus: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        $.ajax({
          url: this.props.url + "playlist/",
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({playlistEntries: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });

    },

    componentDidMount: function() {
      this.loadStatusFromServer();
      setInterval(this.loadStatusFromServer, this.props.pollInterval);
    },

    render: function() {
        var playingId;
        if (this.state.playerStatus.playlist_entry){
            playingId = this.state.playerStatus.playlist_entry.id;
        }

        return (
            <div>
                <div id="playlist">
                    <Player playerStatus={this.state.playerStatus} sendPlayerCommand={this.sendPlayerCommand}/>
                    <Playlist entries={this.state.playlistEntries} playingId={playingId} removeEntry={this.removeEntry}/>
                </div>
                <div id="library">
                    <Library url={this.props.url} pollInterval={this.props.pollInterval} loadStatusFromServer={this.loadStatusFromServer}/>
                </div>
            </div>
        );
    }

}); 


ReactDOM.render(
    <PlayerBox url="/" pollInterval={1000}/>,
    document.getElementById('content')
);


