import React from 'react'
import { connect } from 'react-redux'
import { loadLibraryEntries } from 'actions'
import ListAbstract from '../ListAbstract'
import SongEntry from './Entry'

class SongList extends ListAbstract {
    static getName() {
        return "SongList"
    }

    getLibraryName() {
        return "songs"
    }

    getLibraryEntryList = () => {
        const songs = this.props.entries.data.results

        /**
         * Compute playlist info
         * time when each song is going to be played
         * and currently playing song
         */

        const currentTime = new Date().getTime()
        let remainingTime = 0
        const playerStatus = this.props.playerStatus.status
        const playlistInfo = {}

        // First, if a song is playing,
        // set remainingTime to the duration until end of the song

        if (playerStatus.playlist_entry) {
            // Player is playing a song
            // get playing id
            // and add remaining duration
            const playingId = playerStatus.playlist_entry.song.id
            playlistInfo[playingId] = {
                isPlaying: true,
                owner: playerStatus.playlist_entry.owner
            }

            remainingTime = playerStatus.playlist_entry.song.duration - playerStatus.timing
        }


        // Then for each song in playlist,
        // generate a map with song id as key
        // and time + owner as value

        for(let entry of this.props.playlistEntries.results){
            if (!playlistInfo[entry.song.id]) {
                playlistInfo[entry.song.id] = {
                    timeOfPlay: currentTime + remainingTime * 1000,
                    owner: entry.owner
                }
            }

            remainingTime += +(entry.song.duration)
        }

        /**
         * Create SongEntry for each song
         */

         const libraryEntrySongList = songs.map( song => (
                <SongEntry
                        key={song.id}
                        song={song}
                        playlistInfo={playlistInfo[song.id]}
                        location={this.props.location}
                    />
            ))

        return libraryEntrySongList
    }
}


const mapStateToProps = (state) => ({
    entries: state.library.song,
    playlistEntries: state.player.playlist.entries.data,
    playerStatus: state.player.status.data
})

SongList = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(SongList)

export default SongList
