var $ = jQuery = require('jquery');
var React = require('react');
var Player = require('./Player');
var Playlist = require('./Playlist');
var Library = require('./Library');

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

module.exports = PlayerBox;
