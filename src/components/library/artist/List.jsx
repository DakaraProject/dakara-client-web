import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadLibraryEntries } from 'actions/library'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { withSearchParams } from 'components/generics/Router'
import ArtistEntry from 'components/library/artist/Entry'
import SearchBox from 'components/library/SearchBox'
import { artistStatePropType } from 'reducers/library'

class ArtistList extends Component {
    static propTypes = {
        artistState: artistStatePropType.isRequired,
    }

    /**
     * Fetch artists from server
     */
    refreshEntries = () => {
        this.props.loadLibraryEntries('artists', {
            page: this.props.searchParams.get('page'),
            query: this.props.searchParams.get('query'),
        })
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchParams !== prevProps.searchParams) {
            this.refreshEntries()
        }
    }

    render() {
        const { artists, query, count, pagination } = this.props.artistState.data

        /**
         * Create ArtistEntry for each artist
         */

        const libraryEntryArtistList = artists.map(artist =>
            <ArtistEntry
                key={artist.id}
                artist={artist}
                query={query}
            />
        )

        return (
            <div id="artist-library">
                <SearchBox placeholder="Who are you looking for?" />
                <div className="artist-list">
                    <ListingFetchWrapper
                        status={this.props.artistState.status}
                    >
                        <ul className="library-list listing">
                            {libraryEntryArtistList}
                        </ul>
                    </ListingFetchWrapper>
                    <Navigator
                        count={count}
                        pagination={pagination}
                        names={{
                            singular: 'artist found',
                            plural: 'artists found'
                        }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    artistState: state.library.artist,
})

ArtistList = withSearchParams(connect(
    mapStateToProps,
    { loadLibraryEntries }
)(ArtistList))

export default ArtistList

/**
 * Get a dict with the following:
 * - placeholder: library search placeholder
 */
export const getArtistLibraryNameInfo = () => ({
    placeholder: 'Who are you looking for?',
})
