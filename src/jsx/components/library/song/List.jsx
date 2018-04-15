import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SongEntry from './Entry'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { songStatePropType } from 'reducers/library'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { playlistDigestPropType } from 'reducers/playlist'

class SongList extends Component {
    static propTypes = {
        songState: songStatePropType.isRequired,
        playlistEntriesState: playlistEntriesStatePropType.isRequired,
        playlistDigest: playlistDigestPropType.isRequired,
        location: PropTypes.object.isRequired,
    }

    render() {
        const { songs, count, pagination } = this.props.songState.data

        /**
         * Create SongEntry for each song
         */

         const libraryEntrySongList = songs.map(song => (
                <SongEntry
                        key={song.id}
                        song={song}
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
    playlistEntriesState: state.playlist.entries,
    playlistDigest: state.playlist.digest,
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
