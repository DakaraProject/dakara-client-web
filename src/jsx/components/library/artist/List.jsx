import React, { Component } from 'react'
import { connect } from 'react-redux'
import ArtistEntry from './Entry'
import ListWrapper from '../ListWrapper'
import Navigator from 'components/generics/Navigator'

class ArtistList extends Component {
    render() {
        const { entries } = this.props
        const artists = entries.data.results

        const libraryEntryArtistList = artists.map(artist =>
              <ArtistEntry
                key={artist.id}
                artist={artist}
              />
        )

        const { isFetching, fetchError } = entries

        return [(
            <ListWrapper
                isFetching={isFetching}
                fetchError={fetchError}
            >
                <ul className="library-list listing">
                    {libraryEntryArtistList}
                </ul>
            </ListWrapper>
        ),
        (
            <Navigator
                data={entries.data}
                names={{
                    singular: 'artist found',
                    plural: 'artists found'
                }}
                location={location}
            />
        )]
    }
}

const mapStateToProps = (state) => ({
    entries: state.library.artist,
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
