import React, { Component } from 'react'
import { connect } from 'react-redux'

import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import ArtistEntry from 'components/library/artist/Entry'
import { artistStatePropType } from 'reducers/library'

class ArtistList extends Component {
    static propTypes = {
        artistState: artistStatePropType.isRequired,
    }

    render() {
        const { artists, query, count, pagination } = this.props.artistState.data

        const libraryEntryArtistList = artists.map(artist =>
            <ArtistEntry
                key={artist.id}
                artist={artist}
                query={query}
            />
        )

        return (
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
                    location={this.props.location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    artistState: state.library.artist,
})

ArtistList = connect(
    mapStateToProps,
)(ArtistList)

export default ArtistList

/**
 * Get a dict with the following:
 * - placeholder: library search placeholder
 */
export const getArtistLibraryNameInfo = () => ({
    placeholder: "Who are you looking for?",
})
