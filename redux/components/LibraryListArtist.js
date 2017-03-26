import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import Artist from './Artist'

class LibraryListArtist extends LibraryListAbstract {
    getLibraryName() {
        return "artists"
    }

    render() {
        const artists = this.props.artists
        return (
              <ul>
                {artists.map(artist =>
                  <Artist
                    key={artist.id}
                    artist={artist}
                  />
                )}
              </ul>
              )
    }
}

export default LibraryListArtist
