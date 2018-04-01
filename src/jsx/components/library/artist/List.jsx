import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ArtistEntry from './Entry'
import ListWrapper from '../ListWrapper'
import Navigator from 'components/generics/Navigator'
import { artistLibraryPropType } from 'reducers/library'

class ArtistList extends Component {
    static propTypes = {
        entries: artistLibraryPropType.isRequired,
    }

    render() {
        const { entries } = this.props
        const { results: artists, query } = entries.data

        const libraryEntryArtistList = artists.map(artist =>
            <ArtistEntry
                key={artist.id}
                artist={artist}
                query={query}
            />
        )

        const { isFetching, fetchError } = entries

        return (
            <div className="artist-list">
                <ListWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                >
                    <ul className="library-list listing">
                        {libraryEntryArtistList}
                    </ul>
                </ListWrapper>
                <Navigator
                    data={entries.data}
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
