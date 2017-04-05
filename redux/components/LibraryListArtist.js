import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntryArtist from './LibraryEntryArtist'

class LibraryListArtist extends LibraryListAbstract {
    getLibraryName() {
        return "artists"
    }

    render() {
        const artists = this.props.artists
        return (
              <ul id="library-entries" className="listing">
                {artists.map(artist =>
                  <LibraryEntryArtist
                    key={artist.id}
                    artist={artist}
                  />
                )}
              </ul>
              )
    }
}

export default LibraryListArtist
