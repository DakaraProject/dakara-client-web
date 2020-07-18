import React, { Component } from 'react'
import PropTypes from 'prop-types'
import UserWidget from 'components/generics/UserWidget'
import { formatHourTime } from 'utils'
import { userPropType } from 'serverPropTypes/users'

/**
* Playing or queuing info
* Component displaying time of play or currently playing status
*/
export default class PlayQueueInfo extends Component {
    static propTypes = {
        playingInfo: PropTypes.shape({
            owner: userPropType.isRequired
        }),
        playedInfo: PropTypes.shape({
            timeOfPlay: PropTypes.number.isRequired,
            owner: userPropType.isRequired
        }),
        queueInfo: PropTypes.shape({
            timeOfPlay: PropTypes.number.isRequired,
            owner: userPropType.isRequired
        })
    }

    render() {
        const { playingInfo, playedInfo, queueInfo } = this.props

        let content
        let owner
        if (playingInfo) {
            content = (
                <div className="playing">
                    <span className="icon">
                        <i className="fa fa-play"></i>
                    </span>
                </div>
            )
            owner = playingInfo.owner
        } else if (queueInfo) {
            content = (
                <div className="queueing">
                    {formatHourTime(queueInfo.timeOfPlay)}
                    <span className="icon">
                        <i className="fa fa-fast-forward"></i>
                    </span>
                </div>
            )
            owner = queueInfo.owner
        } else if (playedInfo) {
            content = (
                <div className="played">
                    <span className="icon">
                        <i className="fa fa-fast-backward"></i>
                    </span>
                    {formatHourTime(playedInfo.timeOfPlay)}
                </div>
            )
            owner = playedInfo.owner

        } else {
            // nothing to display
            return null
        }

        return (
            <div className="play-queue-info">
                <UserWidget
                    className="owner"
                    user={owner}
                />
                {content}
            </div>
        )
    }
}
