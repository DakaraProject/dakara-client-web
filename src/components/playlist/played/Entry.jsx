import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { Component } from 'react'

import { withNavigate } from 'components/adapted/ReactRouterDom'
import PlaylistPositionInfo from 'components/song/PlaylistPositionInfo'
import Song from 'components/song/Song'
import { playlistEntryPropType } from 'serverPropTypes/playlist'

class Entry extends Component {
    static propTypes = {
        entry: playlistEntryPropType.isRequired,
        navigate: PropTypes.func.isRequired,
    }

    handleSearch = () => {
        const song = this.props.entry.song
        const query = `title:""${song.title}""`
        this.props.navigate({
            pathname: '/library/song',
            search: stringify({
                query,
                expanded: song.id
            })
        })
    }

    render() {
        const { entry } = this.props

        return (
            <li
                className={
                    'listing-entry playlist-entry library-entry library-entry-song ' +
                    'hoverizable'
                }
            >
                <div className="library-entry-song-compact">
                    <Song
                        song={entry.song}
                        handleClick={this.handleSearch}
                    />
                    <div className="extra">
                        <PlaylistPositionInfo
                            entryPlayed={entry}
                        />
                    </div>
                </div>
            </li>
        )
    }
}

export default withNavigate(Entry)
