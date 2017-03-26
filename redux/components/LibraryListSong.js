import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import Song from './Song'

class LibraryListSong extends LibraryListAbstract {
    getLibraryName() {
        return "songs"
    }

    render() {
        const songs = this.props.songs
        return (
              <ul>
                {songs.map(song =>
                  <Song
                    key={song.id}
                    song={song}
                  />
                )}
              </ul>
              )
    }
}

export default LibraryListSong
