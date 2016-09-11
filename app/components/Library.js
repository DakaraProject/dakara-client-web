var React = require('react');
var SongLibrary = require('./SongLibrary');
var ArtistLibrary = require('./ArtistLibrary');
var Library = React.createClass({

    setQuery: function(query) {
        this.refs['songLibrary'].setQuery(query); 
    },

    render: function() {
        return (
        <div>
            <SongLibrary ref="songLibrary" url={this.props.url} playlistEntries={this.props.playlistEntries} playerStatus={this.props.playerStatus} addToPlaylist={this.props.addToPlaylist}/>
        </div>
        );
//            <ArtistLibrary ref="artistLibrary" url={this.props.url} />
    }
});

module.exports = Library;
