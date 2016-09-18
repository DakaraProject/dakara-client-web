var React = require('react');
var SongLibrary = require('./SongLibrary');
var ArtistLibrary = require('./ArtistLibrary');
var Library = React.createClass({

    setQuery: function(query) {
        this.refs['songLibrary'].setQuery(query); 
    },

    render: function() {
        var library;
        var isHomeActive;
        switch(this.props.page) {
            case "artist":
                library = ( <ArtistLibrary ref="artistLibrary" url={this.props.url} /> );
                isHomeActive = false;
                break;
            default:
                library = ( <SongLibrary ref="songLibrary" url={this.props.url} playlistEntries={this.props.playlistEntries} playerStatus={this.props.playerStatus} addToPlaylist={this.props.addToPlaylist}/> );
                isHomeActive = true;
        }
        return (
        <div>
            <nav id="library-chooser">
                <div className={"library-tab" + (isHomeActive ? " active" : "")} id="library-tab-song" onClick={function() { this.props.switchPage("home")}.bind(this)}>
                    Home
                </div>
                <div className={"library-tab library-tab-item" + (!isHomeActive ? " active" : "")} onClick={function() { this.props.switchPage("artist")}.bind(this)}>
                    Artists 
                </div>
            </nav>
            {library}
        </div>
        );
    }
});

module.exports = Library;
