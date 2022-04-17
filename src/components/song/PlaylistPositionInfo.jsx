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
        entryQueuing: playlistEntryPropType,
        entryPlayed: playlistEntryPropType,
        playerStatus: playerStatusPropType.isRequired,
    }

    /**
     * Return the current playing entry
     */
    getPlaying = (entries) => {
        const { playerStatus } = this.props

        if (!playerStatus.playlist_entry) return null

        return entries.find(e => (e.id === playerStatus.playlist_entry.id))
    }

    /**
     * Return the first queuing entry
     */
    getQueuing = (entries) => {
        return entries.find(e => (e.will_play))
    }

    /**
     * Return the last played entry
     */
    getPlayed = (entries) => {
        return findLast(entries, e => (e.was_played))
    }

    getQueuingContent = (entry) => (
        <div className="queueing">
            {dayjs(entry.date_play).format('HH:mm')}
            <span className="icon">
                <i className="fa fa-fast-forward"></i>
            </span>
        </div>
    )

    getPlayedContent = (entry) => {
        const date = dayjs().diff(entry.date_play, 'day', true) > 1 ?
            'long ago' :
            dayjs(entry.date_play).format('HH:mm')

        return (
            <div className="played">
                <span className="icon">
                    <i className="fa fa-fast-backward"></i>
                </span>
                {date}
            </div>
        )
    }

    render() {
        const { playerStatus, entryQueuing, entryPlayed } = this.props
        let entries
        if (this.props.entries) {
            entries = this.props.entries
        } else if (this.props.entry) {
            entries = [this.props.entry]
        } else {
            entries = []
        }

        let content
        let entry
        if ((entry = entryQueuing)) {
            // a queuing entry is given
            content = this.getQueuingContent(entry)
        } else if ((entry = entryPlayed)) {
            // a played entry is given
            content = this.getPlayedContent(entry)
        } else if ((entry = this.getPlaying(entries))) {
            // the entry is playing
            const icon = playerStatus.paused ? 'fa-pause' : 'fa-play'
            content = (
                <div className="playing">
                    <span className="icon">
                        <i className={`fa ${icon}`}></i>
                    </span>
                </div>
            )
        } else if ((entry = this.getQueuing(entries))) {
            // the entry is queuing
            content = this.getQueuingContent(entry)
        } else if ((entry = this.getPlayed(entries))) {
            // the entry is played
            content = this.getPlayedContent(entry)
        } else {
            return null
        }

        let instrumentalContent
        if (entry.use_instrumental) {
            instrumentalContent = (
                <div className="instrumental">
                    <span className="icon">
                        <i className="fa fa-microphone-slash"></i>
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
