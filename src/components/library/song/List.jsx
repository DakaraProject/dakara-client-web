import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadLibraryEntries } from 'actions/library'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { withSearchParams } from 'components/generics/Router'
import SearchBox from 'components/library/SearchBox'
import SongEntry from 'components/library/song/Entry'
import { songStatePropType } from 'reducers/library'

class SongList extends Component {
    static propTypes = {
        songState: songStatePropType.isRequired,
        playlistDateEnd: PropTypes.string.isRequired,
        karaokeDateStop: PropTypes.string,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
    }

    /**
     * Fetch songs from server
     */
    refreshEntries = () => {
        this.props.loadLibraryEntries('songs', {
            page: this.props.searchParams.get('page'),
            query: this.props.searchParams.get('query'),
        })
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchParams !== prevProps.searchParams) {
            this.refreshEntries()
        }
    }

    render() {
        const { songs, count, pagination } = this.props.songState.data
        const { playlistDateEnd, karaokeDateStop } = this.props

        /**
         * Compute remaining karoke time
         */

        let karaokeRemainingSeconds
        if (karaokeDateStop) {
            karaokeRemainingSeconds = dayjs(karaokeDateStop).diff(
                playlistDateEnd,
                'seconds'
            )
        }

        /**
         * Create SongEntry for each song
         */

        const libraryEntrySongList = songs.map(song => (
             <SongEntry
                key={song.id}
                song={song}
                karaokeRemainingSeconds={karaokeRemainingSeconds}
             />
        ))

        return (
            <div id="song-library">
                <SearchBox placeholder="What will you sing?" />
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
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    songState: state.library.song,
    playlistDateEnd: state.playlist.entries.data.date_end,
    karaokeDateStop: state.playlist.digest.data.karaoke.date_stop,
})

SongList = withSearchParams(connect(
    mapStateToProps,
    { loadLibraryEntries }
)(SongList))

export default SongList

/**
 * Get a dict with the following:
 * - placeholder: library search placeholder
 */
export const getSongLibraryNameInfo = () => ({
    placeholder: 'What will you sing?',
})
