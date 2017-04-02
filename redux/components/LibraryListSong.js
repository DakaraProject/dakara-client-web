import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntrySongPage from '../containers/LibraryEntrySongPage'

class LibraryListSong extends LibraryListAbstract {
    getLibraryName() {
        return "songs"
    }

    render() {
        const songs = this.props.entries.results
        let libraryEntrySongList
        if (this.props.entries.type === 'songs') {
            libraryEntrySongList = songs.map((song) => {
                return (<LibraryEntrySongPage
                        key={song.id}
                        song={song}
                    />)
            })
        }

        return (
              <ul id="library-entries" className="listing">
                  {libraryEntrySongList}
              </ul>
              )
    }
}

export default LibraryListSong
