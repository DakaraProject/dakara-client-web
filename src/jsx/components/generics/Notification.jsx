import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import classNames from 'classnames'
import { Status } from 'reducers/alterationsResponse'
import { alterationResponsePropType } from 'reducers/alterationsResponse'

const notificationTypes = {
    [Status.pending]: 'success',
    [Status.successful]: 'success',
    [Status.failed]: 'danger'
}

/**
 * Notification message
 */
export default class Notification extends Component {
    static propTypes = {
        pendingMessage: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
        successfulMessage: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
        failedMessage: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
        ]),
        pendingDuration: PropTypes.number,
        successfulDuration: PropTypes.number,
        failedDuration: PropTypes.number,
        alterationStatus: alterationResponsePropType,
    }

    static defaultProps = {
        pendingMessage: 'Pending…',
        successfulMessage: 'Success',
        failedMessage: 'Failure',
        pendingDuration: null,
        successfulDuration: 3000,
        failedDuration: 5000,
    }

    state = {display: true}

    componentDidMount() {
        this.setNotificationClearTimeout()
    }

    componentDidUpdate(prevProps) {
        const alterationStatus = this.props.alterationStatus
        const prevAlterationStatus = prevProps.alterationStatus

        const status = alterationStatus ? alterationStatus.status : null
        const prevStatus = prevAlterationStatus ? prevAlterationStatus.status : null
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
