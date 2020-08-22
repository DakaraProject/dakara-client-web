import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserWidget from 'components/generics/UserWidget'
import { formatHourTime } from 'utils'
import { playlistEntryPropType, playlistPlayedEntryPropType } from 'serverPropTypes/playlist'

/**
* Playing or queuing info
* Component displaying time of play or currently playing status
*/
export default class PlayQueueInfo extends Component {
    static propTypes = {
        playingInfo: PropTypes.shape({
            playlistEntry: playlistEntryPropType
        }),
        playedInfo: PropTypes.shape({
            timeOfPlay: PropTypes.number.isRequired,
            playlistEntry: playlistPlayedEntryPropType
        }),
        queueInfo: PropTypes.shape({
            timeOfPlay: PropTypes.number.isRequired,
            playlistEntry: playlistEntryPropType
        })
    }

    render() {
        const { playingInfo, playedInfo, queueInfo } = this.props

        let content
        let entry
        if (playingInfo) {
            content = (
                <div className="playing">
                    <span className="icon">
                        <i className="fa fa-play"></i>
                    </span>
                </div>
            )
            entry = playingInfo.playlistEntry
        } else if (queueInfo) {
            content = (
                <div className="queueing">
                    {formatHourTime(queueInfo.timeOfPlay)}
                    <span className="icon">
                        <i className="fa fa-fast-forward"></i>
                    </span>
                </div>
            )
            entry = queueInfo.playlistEntry
        } else if (playedInfo) {
            content = (
                <div className="played">
                    <span className="icon">
                        <i className="fa fa-fast-backward"></i>
                    </span>
                    {formatHourTime(playedInfo.timeOfPlay)}
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
                        <i className="fa fa-microphone-slash"></i>
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
