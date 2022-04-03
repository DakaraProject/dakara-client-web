import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { withNavigate } from 'components/generics/Router'
import { artistPropType } from 'serverPropTypes/library'

class ArtistEntry extends Component {
    static propTypes = {
        artist: artistPropType.isRequired,
        navigate: PropTypes.func.isRequired,
        query: PropTypes.object,
    }

    /**
     * Search songs associated with the artist
     */
    handleSearch = () => {
        const newQuery = `artist:""${this.props.artist.name}""`
        this.props.navigate({
            pathname: '/library/song',
            search: stringify({query: newQuery})
        })
    }

    render() {
        return (
            <li
                className="library-entry listing-entry library-entry-artist hoverizable"
            >
                <div className="library-entry-work-artist-display">
                    <div className="header">
                        <HighlighterQuery
                            className="name"
                            query={this.props.query}
                            searchWords={(q) => (q.remaining)}
                            textToHighlight={this.props.artist.name}
                        />
                    </div>
                    <div className="songs-amount">
                        {this.props.artist.song_count}
                    </div>
                </div>
                <div className="controls">
                    <button className="control primary" onClick={this.handleSearch}>
                        <span className="icon">
                            <i className="fa fa-search"></i>
                        </span>
                    </button>
                </div>
            </li>
        )
    }
}

export default withNavigate(ArtistEntry)
