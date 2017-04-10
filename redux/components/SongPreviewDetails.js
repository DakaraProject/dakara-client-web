import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import WorkDisplay from './WorkDisplay'

export default class SongPreviewDetails extends Component {
    render() {
        const song = this.props.song

        /**
         * Display first work if any
         * Highlighted with query
         */

        let work
        if (song.works.length > 0) {
            // display the first work only for this display
            let w = song.works[0]
            work = (<WorkDisplay work={w} query={this.props.query}/>)
        }

        /**
         * Display all artists
         * Highlighted with query
         */

        let artists
        if (song.artists.length > 0) {
            // define a function that gives the artist name or the artist name
            // highlighted
            let displayArtist
            if (this.props.query != undefined) {
                displayArtist = (artist, query) => (
                        <Highlighter
                            searchWords={query.artists.concat(
                                    query.remaining
                                    )}
                            textToHighlight={artist.name}
                        />
                )
            } else {
                displayArtist = (artist, query) => artist.name
            }

            let artistsList = song.artists.map( artist => (
                    <span
                        className="artist"
                        key={artist.name}
                    >
                        {displayArtist(artist, this.props.query)}
                    </span>
            ))

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
