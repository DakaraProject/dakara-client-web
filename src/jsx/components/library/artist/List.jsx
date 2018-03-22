import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ArtistEntry from './Entry'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { artistLibraryPropType } from 'reducers/library'

class ArtistList extends Component {
    static propTypes = {
        artistLibrary: artistLibraryPropType.isRequired,
    }

    render() {
        const { artists, query, count, pagination } = this.props.artistLibrary.data

        const libraryEntryArtistList = artists.map(artist =>
            <ArtistEntry
                key={artist.id}
                artist={artist}
            />
        )

        return (
            <div className="artist-list">
                <ListingFetchWrapper
                    status={this.props.artistLibrary.status}
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
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    artistLibrary: state.library.artist,
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
