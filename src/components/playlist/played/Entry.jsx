import { stringify } from 'query-string'
import React, { Component } from 'react'

import PlayQueueInfo from 'components/song/PlayQueueInfo'
import Song from 'components/song/Song'
import { playlistPlayedEntryPropType } from 'serverPropTypes/playlist'

class Entry extends Component {
    static propTypes = {
        entry: playlistPlayedEntryPropType.isRequired,
    }

    handleSearch = () => {
        const song = this.props.entry.song
        const query = `title:""${song.title}""`
        this.props.history.push({
            pathname: "/library/song",
            search: stringify({
                query,
                expanded: song.id
            })
        })
    }

    render() {
        const { entry } = this.props
        const datePlayed = Date.parse(entry.date_played)

        return (
            <li
            className={
                "listing-entry playlist-entry library-entry library-entry-song " +
                "hoverizable"
            }
            >
                <div className="library-entry-song-compact">
                    <Song
                        song={entry.song}
                        handleClick={this.handleSearch}
                    />
                    <PlayQueueInfo
                        playedInfo={{timeOfPlay: datePlayed, playlistEntry: entry}}
                    />
                </div>
            </li>
        )
    }
}

export default Entry
