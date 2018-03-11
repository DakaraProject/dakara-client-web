import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import PropTypes from 'prop-types'
import { artistPropType } from 'serverPropTypes/library'

/**
 * Display all artists
 * Highlighted with query
 * props:
 * - artists
 * - query
 */
export default class SongArtistList extends Component {
    static propTypes = {
        query: PropTypes.object,
        artists: PropTypes.arrayOf(artistPropType).isRequired,
    }

    render() {

        // define a function that gives the artist name or the artist name
        // highlighted
        let displayArtist
        if (this.props.query != undefined) {
            displayArtist = (artist, query) => (
                    <Highlighter
                        searchWords={query.artist.contains.concat(
                                query.remaining
                                )}
                        textToHighlight={artist.name}
                        autoEscape
                    />
            )
        } else {
            displayArtist = (artist, query) => artist.name
        }

        const artistsList = this.props.artists.map(artist => (
                <span
                    className="artist"
                    key={artist.name}
                >
                    {displayArtist(artist, this.props.query)}
                </span>
        ))


        return (
                <div className="artists">
                    {artistsList}
                </div>
            )
    }
}
