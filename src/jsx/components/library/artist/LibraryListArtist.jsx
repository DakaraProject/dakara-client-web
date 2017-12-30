import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import LibraryListAbstract from '../LibraryListAbstract'
import LibraryEntryArtist from './LibraryEntryArtist'

class LibraryListArtist extends LibraryListAbstract {
    static getName() {
        return "LibraryListArtist"
    }

    getLibraryName() {
        return "artists"
    }

    getLibraryEntryList = () => {
        const artists = this.props.entries.data.results
        const libraryEntryArtistList = artists.map(artist =>
              <LibraryEntryArtist
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

LibraryListArtist = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(LibraryListArtist)

export default LibraryListArtist
