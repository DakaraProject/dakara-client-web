import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import UserWidget from 'components/generics/UserWidget'
import {
    playlistEntryPropType,
    playlistPlayedEntryPropType
} from 'serverPropTypes/playlist'

/**
* Playing or queuing info
* Component displaying time of play or currently playing status
*/
export default class PlayQueueInfo extends Component {
    static propTypes = {
        playedInfo: PropTypes.shape({
            playlistEntry: playlistPlayedEntryPropType,
            timeOfPlay: PropTypes.number.isRequired,
        }),
        playingInfo: PropTypes.shape({
            playlistEntry: playlistEntryPropType,
        }),
        queueInfo: PropTypes.shape({
            playlistEntry: playlistEntryPropType,
            timeOfPlay: PropTypes.number.isRequired,
        }),
    }

    render() {
        const { playingInfo, playedInfo, queueInfo } = this.props

        let content
        let entry
        if (playingInfo) {
            content = (
                <div className="playing">
                    <span className="icon">
                        <i className="las la-play"></i>
                    </span>
                </div>
            )
            entry = playingInfo.playlistEntry
        } else if (queueInfo) {
            content = (
                <div className="queueing">
                    {dayjs(queueInfo.timeOfPlay).format('HH:mm')}
                    <span className="icon">
                        <i className="las la-chevron-right"></i>
                    </span>
                </div>
            )
            entry = queueInfo.playlistEntry
        } else if (playedInfo) {
            content = (
                <div className="played">
                    <span className="icon">
                        <i className="las la-chevron-left"></i>
                    </span>
                    {dayjs(playedInfo.timeOfPlay).format('HH:mm')}
                </div>
            )
            entry = playedInfo.playlistEntry
        } else {
            // nothing to display
            return null
        }


        let instrumentalIcon
        if (entry.use_instrumental) {
            instrumentalIcon = (
                <div className="instrumental">
                    <span className="icon">
                        <i className="las la-microphone-slash"></i>
                    </span>
                </div>
            )
        }

        return (
            <div className="play-queue-info">
                <UserWidget
                    className="owner"
                    user={entry.owner}
                />
                {content}
                {instrumentalIcon}
            </div>
        )
    }
}
