var $ = jQuery = require('jquery');
var React = require('react');
var Player = require('./Player');
var Playlist = require('./Playlist');
var Library = require('./Library');

var PlayerBox = React.createClass({
    getInitialState: function() {
        return {
            playerStatus: {
                playlist_entry: null,
                timing: 0
            },
            playlistEntries: {
                count: 0,
                results: []
            },
            userCmd: {
                pause: false,
                skip: false
            },
            playerErrorsOldId: []
        };
    },

    setSearch: function(search) {
        this.refs['library'].setQuery(search); 
    },

    sendPlayerCommand : function(cmd, callback) {
        $.ajax({
        url: this.props.url + "playlist/player/manage/",
        dataType: 'json',
        type: 'PUT',
        data: cmd,
        success: function(data) {
            callback(true, cmd);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false, cmd);
            console.error(this.props.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    removeEntry : function(entryId, callback) {
        $.ajax({
        url: this.props.url + "playlist/" + entryId + "/",
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
            callback(true);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false);
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
            }.bind(this),
            statusCode: {
                403: function() {
                   window.location = this.props.url + "api-auth/login/?next=/"; 
                }.bind(this)
            }
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
        $.ajax({
            url: this.props.url + "playlist/player/manage/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({userCmd: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        $.ajax({
            url: this.props.url + "playlist/player/errors/",
            dataType: 'json',
            cache: false,
            success: this.addPlayerErrors,
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    addPlayerErrors: function (data) {
        // add player errors to notification if they are new
        if (data) {
            var errorsId = [];
            for (error of data) {
                if (this.state.playerErrorsOldId.indexOf(error.id) == -1) {
                    errorsId.push(error.id);
                    this.refs.player.addNotification(
                            "Error with " + error.song.title + ": " + error.error_message,
                            "danger",
                            5000
                            );
                }
            }
            this.setState({playerErrorsOldId: this.state.playerErrorsOldId.concat(errorsId)});
        }
    },

    componentDidMount: function() {
      this.loadStatusFromServer();
      setInterval(this.loadStatusFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div>
                <div id="playlist">
                    <Player ref={'player'} playerStatus={this.state.playerStatus} sendPlayerCommand={this.sendPlayerCommand} userCmd={this.state.userCmd}/>
                    <Playlist entries={this.state.playlistEntries} playerStatus={this.state.playerStatus} removeEntry={this.removeEntry} setSearch={this.setSearch}/>
                </div>
                <div id="library">
                    <Library ref="library" url={this.props.url} pollInterval={this.props.pollInterval} playlistEntries={this.state.playlistEntries} playerStatus={this.state.playerStatus} loadStatusFromServer={this.loadStatusFromServer}/>
                </div>
            </div>
        );
    }

}); 

module.exports = PlayerBox;
