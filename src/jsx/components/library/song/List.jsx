import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SongEntry from './Entry'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { songStatePropType } from 'reducers/library'
import { playlistStatePropType } from 'reducers/playlist'
import { playlistAppDigestPropType } from 'reducers/playlistApp'

class SongList extends Component {
    static propTypes = {
        songState: songStatePropType.isRequired,
        playlistState: playlistStatePropType.isRequired,
        playlistAppDigest: playlistAppDigestPropType.isRequired,
        location: PropTypes.object.isRequired,
    }

    render() {
        const { songs, count, pagination } = this.props.songState.data

        /**
         * Compute playlist info
         * time when each song is going to be played
         * and currently playing song
         */

        const currentTime = new Date().getTime()
        let remainingTime = 0
        const playerStatus = this.props.playlistAppDigest.data.player_status
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

        for (let entry of this.props.playlistState.data.playlistEntries) {
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

        return (
            <div className="song-list">
                <ListingFetchWrapper
                    status={this.props.songState.status}
                >
                    <ul className="library-list listing">
                        {libraryEntrySongList}
                    </ul>
                </ListingFetchWrapper>
                <Navigator
                    count={count}
                    pagination={pagination}
                    names={{
                        singular: 'song found',
                        plural: 'songs found'
                    }}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    songState: state.library.song,
    playlistState: state.playlistApp.playlist,
    playlistAppDigest: state.playlistApp.digest,
})

SongList = connect(
    mapStateToProps,
)(SongList)

export default SongList

/**
 * Get a dict with the following:
 * - placeholder: library search placeholder
 */
export const getSongLibraryNameInfo = () => ({
    placeholder: "What will you sing?",
})
