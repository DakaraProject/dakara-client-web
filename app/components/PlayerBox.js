var $ = jQuery = require('jquery');
var React = require('react');
var Player = require('./Player');
var Playlist = require('./Playlist');
var Library = require('./Library');
var utils = require('../dakara-utils');

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
        url: utils.params.url + "playlist/player/manage/",
        dataType: 'json',
        type: 'PUT',
        data: cmd,
        success: function(data) {
            callback(true, cmd);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false, cmd);
            console.error(utils.params.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    removeEntry : function(entryId, callback) {
        $.ajax({
        url: utils.params.url + "playlist/" + entryId + "/",
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
            callback(true);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false);
            console.error(utils.params.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },


    loadStatusFromServer: function() {
        $.ajax({
            url: utils.params.url + "playlist/player/status/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({playerStatus: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(utils.params.url, status, err.toString());
            }.bind(this),
            statusCode: {
                403: function() {
                   window.location = utils.params.url + "api-auth/login/?next=/"; 
                }.bind(this)
            }
        });
        $.ajax({
          url: utils.params.url + "playlist/",
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({playlistEntries: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(utils.params.url, status, err.toString());
          }.bind(this)
        });
        $.ajax({
            url: utils.params.url + "playlist/player/manage/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({userCmd: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(utils.params.url, status, err.toString());
            }.bind(this)
        });
        $.ajax({
            url: utils.params.url + "playlist/player/errors/",
            dataType: 'json',
            cache: false,
            success: this.addPlayerErrors,
            error: function(xhr, status, err) {
              console.error(utils.params.url, status, err.toString());
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

    addToPlaylist: function(songId, callback) {
        $.ajax({
            url: utils.params.url + "playlist/",
            dataType: 'json',
            type: 'POST',
            data: {"song": songId},
            success: function(data) {
                callback(true);
                this.loadStatusFromServer();
            }.bind(this),
            error: function(xhr, status, err) {
                callback(false);
                console.error(utils.params.url, status, err.toString() + xhr.responseText);
            }.bind(this)
        }); 
    },

    componentDidMount: function() {
      this.loadStatusFromServer();
      setInterval(this.loadStatusFromServer, utils.params.pollInterval);
    },

    switchPage: function(page) {
        var query = $.extend(true, {}, this.props.location.query, {page: page});
        var location = $.extend(true, {}, this.props.location, {query: query});
        this.props.history.push(location);
    },

    render: function() {
        return (
            <div>
                <div id="playlist">
                    <Player ref={'player'} playerStatus={this.state.playerStatus} sendPlayerCommand={this.sendPlayerCommand} userCmd={this.state.userCmd}/>
                    <Playlist entries={this.state.playlistEntries} playerStatus={this.state.playerStatus} removeEntry={this.removeEntry} setSearch={this.setSearch}/>
                </div>
                <div id="library">
                    <Library ref="library" switchPage={this.switchPage} page={this.props.location.query.page} playlistEntries={this.state.playlistEntries} playerStatus={this.state.playerStatus} addToPlaylist={this.addToPlaylist}/>
                </div>
            </div>
        );
    }

}); 

module.exports = PlayerBox;
