import React from 'react';
import Highlighter from 'react-highlight-words';
import WorkDisplay from './WorkDisplay';

var SongPreviewDetails = React.createClass({
    render: function() {
        var song = this.props.song;
        var work;
        if (song.works.length > 0) {
            var w = song.works[0];
            work = (<WorkDisplay work={w} query={this.props.query}/>);
        }

        var artists;
        if(song.artists.length > 0) {
            var displayArtist;
            if (this.props.query != undefined) {
                displayArtist = function(artist, query) {
                    return (
                        <Highlighter
                            searchWords={query.artists.concat(
                                    query.remaining
                                    )}
                            textToHighlight={artist.name}
                        />
                    );
                };
            } else {
                displayArtist = function(artist, query) {
                    return artist.name;
                };
            }

            var artistsList = song.artists.map(function(artist) {
                var artist;
                return (<span className="artist">
                        {displayArtist(artist, this.props.query)}
                    </span>);
            }.bind(this));
            artists = (<div className="artists">{artistsList}</div>);
        }

        return (
                <div className="song-preview-details">
                    {work}
                    {artists}
                </div>
            )
    }
});

module.exports = SongPreviewDetails;
