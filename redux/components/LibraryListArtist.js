import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryArtist from './LibraryEntryArtist'

class LibraryListArtist extends LibraryListAbstract {
    getLibraryName() {
        return "artists"
    }

    getLibraryEntryList = () => {
        const artists = this.props.entries.data.results
        let libraryEntryArtistList
        if (this.props.entries.type === "artists") {
            libraryEntryArtistList = artists.map(artist =>
                  <LibraryEntryArtist
                    key={artist.id}
                    artist={artist}
                  />
            )
        }

        return libraryEntryArtistList
    }
}

export default LibraryListArtist
