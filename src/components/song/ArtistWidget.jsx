import PropTypes from 'prop-types'
import React, { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { artistPropType } from 'serverPropTypes/library'

export default class ArtistWidget extends Component {
    static propTypes = {
        artist: artistPropType.isRequired,
        noIcon: PropTypes.bool,
        query: PropTypes.object,
    }

    render() {
        const { artist, query, noIcon } = this.props

        return (
            <div className="artist-widget">
                {
                    noIcon ? null : (
                        <span className="icon">
                            <i className="las la-microphone-alt"></i>
                        </span>
                    )
                }
                <HighlighterQuery
                    className="artist"
                    query={query}
                    searchWords={(q) => (q.artist.contains.concat(q.remaining))}
                    textToHighlight={artist.name}
                />
            </div>
        )
    }
}
