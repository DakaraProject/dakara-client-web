import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import ListAbstract from '../ListAbstract'
import ArtistEntry from './Entry'

class ArtistList extends ListAbstract {

    /**
     * Get a dict with the following:
     * - singular: library singular name
     * - plural: library plural name
     * - placeholder: library search placeholder
     */
    static getLibraryNameInfo() {
        return {
            singular: "artist",
            plural: "artists",
            placeholder: "Who are you looking for?"
        }
    }

    static getLibraryEntries(library) {
        return library.artist
    }

    getLibraryType() {
        return "artists"
    }

    getLibraryEntryList = () => {
        const artists = this.props.entries.data.results
        const libraryEntryArtistList = artists.map(artist =>
              <ArtistEntry
                key={artist.id}
                artist={artist}
              />
        )

        return libraryEntryArtistList
    }
}

const mapStateToProps = (state) => ({
    entries: state.library.artist
})

ArtistList = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(ArtistList)

export default ArtistList
