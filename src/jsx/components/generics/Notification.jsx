import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'
import { Status } from 'reducers/alterationsStatus'

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
        failedMessage: 'Failure',
        pendingDuration: null,
        successfulDuration: 3000,
        failedDuration: 5000,
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
        const durations = {
            [Status.pending]: this.props.pendingDuration,
            [Status.successful]: this.props.successfulDuration,
            [Status.failed]: this.props.failedDuration
        }
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
                const messages = {
                    [Status.pending]: this.props.pendingMessage,
                    [Status.successful]: this.props.successfulMessage,
                    [Status.failed]: this.props.failedMessage
                }

                message = messages[status]
            }

            // if there is no message to display, do not show any notification
            if (message) {
                const notificationClass = classNames(
                    'notification',
                    'message',
                    notificationTypes[status]
                )

                notification = (
                    <CSSTransition
                        classNames="notified"
                        timeout={{
                            enter: 300,
                            exit: 150
                        }}
                    >
                        <div className="notified">
                            <div className={notificationClass}>
                                {message}
                            </div>
                        </div>
                    </CSSTransition>
                )
            }
        }

        return (
            <TransitionGroup>
                {notification}
            </TransitionGroup>
        )
    }
}
