import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryArtist from './LibraryEntryArtist'

class LibraryListArtist extends LibraryListAbstract {
    getLibraryName() {
        return "artists"
    }

    render() {
        const artists = this.props.entries.results
        let libraryEntryArtistList
        if (this.props.entries.type === "artists") {
            libraryEntryArtistList = artists.map(artist =>
                  <LibraryEntryArtist
                    key={artist.id}
                    artist={artist}
                  />
            )
        }
        return (
              <ul className="library-entries listing">
                {libraryEntryArtistList}
              </ul>
              )
    }
}

export default LibraryListArtist
