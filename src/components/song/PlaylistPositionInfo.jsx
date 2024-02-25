import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import UserWidget from 'components/generics/UserWidget'
import { playerStatusPropType,playlistEntryPropType } from 'serverPropTypes/playlist'
import { findLast } from 'utils'


/**
* Playlist position info
* Component displaying time of play or currently playing status
*/
class PlaylistPositionInfo extends Component {
    static propTypes = {
        entries: PropTypes.arrayOf(playlistEntryPropType),
        entry: playlistEntryPropType,
        playerStatus: playerStatusPropType.isRequired,
    }

    /**
     * Return the current playing entry
     */
    getPlaying = (entries) => {
        const { playerStatus } = this.props

        if (!playerStatus.playlist_entry) return null

        return entries.find(e => e.id === playerStatus.playlist_entry.id)
    }

    /**
     * Return the first queuing entry
     */
    getQueuing = (entries) => {
        return entries.find(e => !e.was_played)
    }

    /**
     * Return the last played entry
     */
    getPlayed = (entries) => {
        return findLast(entries, e => e.was_played)
    }

    render() {
        const { playerStatus } = this.props
        const entries = this.props.entries || [this.props.entry]

        let content
        let entry
        if ((entry = this.getPlaying(entries))) {
            // the entry is playing
            const icon = playerStatus.paused ? 'la-pause' : 'la-play'
            content = (
                <div className="playing">
                    <span className="icon">
                        <i className={`las ${icon}`}></i>
                    </span>
                </div>
            )
        } else if ((entry = this.getQueuing(entries))) {
            // the entry is queuing
            content = (
                <div className="queueing">
                    {dayjs(entry.date_play).format('HH:mm')}
                    <span className="icon">
                        <i className="las la-chevron-right"></i>
                    </span>
                </div>
            )
        } else if ((entry = this.getPlayed(entries))) {
            // the entry is played
            const date = dayjs().diff(entry.date_play, 'day', true) > 1 ?
                'long ago' :
                dayjs(entry.date_play).format('HH:mm')

            content = (
                <div className="played">
                    <span className="icon">
                        <i className="las la-chevron-left"></i>
                    </span>
                    {date}
                </div>
            )
        } else {
            // nothing to display
            return null
        }

        let instrumentalContent
        if (entry.use_instrumental) {
            instrumentalContent = (
                <div className="instrumental">
                    <span className="icon">
                        <i className="las la-microphone-slash"></i>
                    </span>
                </div>
            )
        }

        return (
            <div className="playlist-position-info">
                <UserWidget
                    className="owner"
                    user={entry.owner}
                />
                {content}
                {instrumentalContent}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playerStatus: state.playlist.playerStatus.data,
})

PlaylistPositionInfo = connect(
    mapStateToProps,
    {}
)(PlaylistPositionInfo)

export default PlaylistPositionInfo
