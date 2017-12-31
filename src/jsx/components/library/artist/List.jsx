import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import ListAbstract from '../ListAbstract'
import ArtistEntry from './Entry'

class ArtistList extends ListAbstract {
    static getName() {
        return "ArtistList"
    }

    getLibraryName() {
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
