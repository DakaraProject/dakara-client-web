import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import WorkDisplay from './WorkDisplay'

export default class SongPreviewDetails extends Component {
    render() {
        const song = this.props.song
        let work
        if (song.works.length > 0) {
            // display the first work only for this display
            let w = song.works[0]
            work = (<WorkDisplay work={w} query={this.props.query}/>)
        }

        let artists
        if (song.artists.length > 0) {
            // define a function that gives the artist name or the artist name
            // highlighted
            let displayArtist

            if (this.props.query != undefined) {
                displayArtist = function(artist, query) {
                    return (
                        <Highlighter
                            searchWords={query.artists.concat(
                                    query.remaining
                                    )}
                            textToHighlight={artist.name}
                        />
                    )
                }
            } else {
                displayArtist = function(artist, query) {
                    return artist.name
                }
            }

            let artistsList = song.artists.map(function(artist) {
                return (<span
                        className="artist"
                        key={artist.name}
                    >
                        {displayArtist(artist, this.props.query)}
                    </span>)
            }.bind(this))
            artists = (<div className="artists">{artistsList}</div>)
        }

        return (
                <div className="song-preview-details">
                    {work}
                    {artists}
                </div>
            )
    }
}
