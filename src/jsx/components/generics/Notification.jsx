import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import classNames from 'classnames'
import { Status } from 'reducers/alterationsStatus'

const durations = {
    [Status.pending]: null,
    [Status.successful]: 3000,
    [Status.failed]: 5000
}

const notificationTypes = {
    [Status.pending]: 'success',
    [Status.successful]: 'success',
    [Status.failed]: 'danger'
}

/**
 * Notification message
 */
export default class Notification extends Component {
    state = {display: true}

    static defaultProps = {
        pendingMessage: 'Pending…',
        successfulMessage: 'Success',
        failedMessage: 'Failure'
    }

    componentDidMount() {
        this.setNotificationClearTimeout()
    }

    componentDidUpdate(prevProps) {
        const alterationStatus = this.props.alterationStatus
        const prevRequestStatus = prevProps.alterationStatus

        const status = alterationStatus ? alterationStatus.status : null
        const prevStatus = prevRequestStatus ? prevRequestStatus.status : null
        if (status != prevStatus) {
            if (this.timeout) {
                clearTimeout(this.timeout)
            }

            this.setState({display: true})
            this.setNotificationClearTimeout()
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    setNotificationClearTimeout = () => {
        const alterationStatus = this.props.alterationStatus
        const status = alterationStatus ? alterationStatus.status : null
        const duration = durations[status]

        if (duration) {
            this.timeout = setTimeout( () => {
                    this.setState({display: false})
                },
                duration
            )
        }
    }

    render() {
        let notification
        if (this.state.display && this.props.alterationStatus) {
            const status = this.props.alterationStatus.status
            let message = this.props.alterationStatus.message

            // if there is a message in the state, keep it
            // otherwise, use the message passed to the compenent
            if (!message) {
                switch (status) {
                    case Status.pending:
                        message = this.props.pendingMessage
                        break

                    case Status.successful:
                        message = this.props.successfulMessage
                        break

                    case Status.failed:
                        message = this.props.failedMessage
                        break
                }
            }

            // if there is no message to display, do not show any notification
            if (message) {
                const notificationClass = classNames(
                    'notification',
                    'message',
                    notificationTypes[status]
                )

                notification = (
                    <div className="notified">
                        <div className={notificationClass}>
                            {message}
                        </div>
                    </div>
                )
            }
        }

        return (
            <ReactCSSTransitionGroup
                transitionName="notified"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={150}
            >
                {notification}
            </ReactCSSTransitionGroup>
        )
    }
}
