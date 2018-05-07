import React, { Component } from 'react'
import { stringify } from 'query-string'
import PropTypes from 'prop-types'
import Song from 'components/song/Song'
import PlayQueueInfo from 'components/song/PlayQueueInfo'
import DisabledFeedback from 'components/song/DisabledFeedback'
import { playlistPlayedEntryPropType } from 'serverPropTypes/playlist'

class PlaylistPlayedEntry extends Component {
    static propTypes = {
        entry: playlistPlayedEntryPropType.isRequired,
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.object.isRequired
        })
    }

    handleSearch = () => {
        const song = this.props.entry.song
        const query = `title:""${song.title}""`
        this.context.router.history.push({
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
            <li className="listing-entry playlist-entry library-entry library-entry-song hoverizable">
                <div className="library-entry-song-compact">
                    <DisabledFeedback tags={entry.song.tags}/>
                    <Song
                        song={entry.song}
                        handleClick={this.handleSearch}
                    />
                    <PlayQueueInfo playedInfo={{timeOfPlay: datePlayed, owner: entry.owner}}/>
                </div>
            </li>
        )
    }
}

export default PlaylistPlayedEntry
