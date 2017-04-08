import React from 'react'
import LibraryListAbstract from './LibraryListAbstract'
import LibraryEntrySongPage from '../containers/LibraryEntrySongPage'

class LibraryListSong extends LibraryListAbstract {
    getLibraryName() {
        return "songs"
    }

    render() {
        const songs = this.props.entries.results

        //compute time when each song is going to be played
        var currentTime = new Date().getTime();
        var remainingTime = 0;
        var playerStatus = this.props.playerStatus;
        var playingId;
        if (playerStatus.playlist_entry) {
            playingId = playerStatus.playlist_entry.song.id;
            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing;
        }
        var timeOfPlay = {};
        for(var entry of this.props.playlistEntries.results){
            if (!timeOfPlay[entry.song.id]) {
                timeOfPlay[entry.song.id] = currentTime + remainingTime * 1000;
            }
            remainingTime += +(entry.song.duration);
        }

        let libraryEntrySongList
        if (this.props.entries.type === 'songs') {
            libraryEntrySongList = songs.map((song) => {
                return (<LibraryEntrySongPage
                        key={song.id}
                        song={song}
                        isPlaying={song.id == playingId}
                        timeOfPlay={timeOfPlay[song.id]}
                        location={this.props.location}
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
