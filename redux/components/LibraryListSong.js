import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntrySongPage from '../containers/LibraryEntrySongPage'

class LibraryListSong extends LibraryListAbstract {
    getLibraryName() {
        return "songs"
    }

    render() {
        const songs = this.props.entries.results

        /**
         * Compute playlist info
         * time when each song is going to be played
         * and currently playing song
         */

        const currentTime = new Date().getTime();
        let remainingTime = 0;
        const playerStatus = this.props.playerStatus.status;
        let playingId;
        if (playerStatus.playlist_entry) {
            // Player is playing a song
            // get playing id
            // and add remaining duration
            playingId = playerStatus.playlist_entry.song.id;
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing;
        }
        const timeOfPlay = {};
        for(let entry of this.props.playlistEntries.results){
            if (!timeOfPlay[entry.song.id]) {
                timeOfPlay[entry.song.id] = currentTime + remainingTime * 1000;
            }
            remainingTime += +(entry.song.duration);
        }

        /**
         * Create LibraryEntrySong for each song
         */

        let libraryEntrySongList
        if (this.props.entries.type === 'songs') {
            libraryEntrySongList = songs.map( song => (
                <LibraryEntrySongPage
                        key={song.id}
                        song={song}
                        isPlaying={song.id == playingId}
                        timeOfPlay={timeOfPlay[song.id]}
                        location={this.props.location}
                    />
            ))
        }

        return (
              <ul className="library-entries listing">
                  {libraryEntrySongList}
              </ul>
        )
    }
}

export default LibraryListSong
