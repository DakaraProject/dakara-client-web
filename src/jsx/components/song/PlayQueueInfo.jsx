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
        isPlaying: PropTypes.bool,
        timeOfPlay: PropTypes.number,
        owner: userPropType.isRequired,
    }

    render() {
        const { isPlaying, timeOfPlay, owner } = this.props

        let playQueueInfoContent
        if (isPlaying) {
            playQueueInfoContent = (
                <div className="playing">
                    <span className="icon">
                        <i className="fa fa-play"></i>
                    </span>
                </div>
            )
        } else {
            playQueueInfoContent = (
                <div className="queueing">
                    <span className="icon">
                        <i className="fa fa-clock-o"></i>
                    </span>
                    {formatHourTime(timeOfPlay)}
                </div>
            )
        }

        return (
            <div className="play-queue-info">
                <UserWidget
                    className="owner"
                    user={owner}
                />
                {playQueueInfoContent}
            </div>
        )
    }
}
