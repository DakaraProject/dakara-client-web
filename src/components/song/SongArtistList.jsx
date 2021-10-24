import PropTypes from 'prop-types'
import React, { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
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
        const artistsList = this.props.artists.map((artist) => (
                <HighlighterQuery
                    className="artist"
                    key={artist.name}
                    query={this.props.query}
                    searchWords={(q) => (q.artist.contains.concat(q.remaining))}
                    textToHighlight={artist.name}
                />
        ))

        return (
                <div className="artists">
                    {artistsList}
                </div>
            )
    }
}
