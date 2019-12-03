import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import SongEntry from './Entry'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { songStatePropType } from 'reducers/library'
import { playlistEntriesStatePropType } from 'reducers/playlist'
import { playlistDigestPropType } from 'reducers/playlist'

class SongList extends Component {
    static propTypes = {
        songState: songStatePropType.isRequired,
        playlistDateEnd: PropTypes.string.isRequired,
        karaokeDateStop: PropTypes.string,
        location: PropTypes.object.isRequired,
    }

    render() {
        const { songs, count, pagination } = this.props.songState.data
        const { playlistDateEnd, karaokeDateStop, location } = this.props

        /**
         * Compute remaining karoke time
         */

        let karaokeRemainingSeconds
        if (karaokeDateStop) {
            karaokeRemainingSeconds = dayjs(karaokeDateStop).diff(playlistDateEnd, 'seconds')
        }

        /**
         * Create SongEntry for each song
         */

         const libraryEntrySongList = songs.map(song => (
                <SongEntry
                        key={song.id}
                        song={song}
                        karaokeRemainingSeconds={karaokeRemainingSeconds}
                        location={location}
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
    playlistDateEnd: state.playlist.entries.data.date_end,
    karaokeDateStop: state.playlist.digest.data.karaoke.date_stop,
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
