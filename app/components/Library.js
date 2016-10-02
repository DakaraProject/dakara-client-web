var React = require('react');
var SongLibrary = require('./SongLibrary');
var ArtistLibrary = require('./ArtistLibrary');
var Library = React.createClass({

    render: function() {
        var library;
        var isHomeActive;
        switch(this.props.libraryName) {
            case "artist":
                library = ( <ArtistLibrary
                                ref="artistLibrary"
                                url={this.props.url}
                                libraryParams={this.props.libraryParams}
                            /> );
                isHomeActive = false;
                break;
            default:
                library = ( <SongLibrary
                                ref="songLibrary"
                                libraryParams={this.props.libraryParams}
                                playlistEntries={this.props.playlistEntries}
                                playerStatus={this.props.playerStatus}
                                addToPlaylist={this.props.addToPlaylist}
                                navigator={this.props.navigator}
                            /> );
                isHomeActive = true;
        }
        return (
        <div>
            <nav id="library-chooser">
                <div
                    className={"library-tab" + (isHomeActive ? " active" : "")}
                    id="library-tab-song"
                    onClick={function() {this.props.navigator.setLibrary("home")}.bind(this)}
                >
                    Home
                </div>
                <div
                    className={"library-tab library-tab-item" + (!isHomeActive ? " active" : "")}
                    onClick={function() {this.props.navigator.setLibrary("artist")}.bind(this)}
                >
                    Artists
                </div>
            </nav>
            {library}
        </div>
        );
    }
});

module.exports = Library;
