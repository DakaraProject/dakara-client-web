import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import classNames from 'classnames'

/**
 * Notification message
 */
export default class Notification extends Component {
    state = {display: true}

    componentDidMount() {
        this.setNotificationClearTimeout()
    }

    componentDidUpdate(prevProps) {
        const notification = this.props.notification
        const prevNotification = prevProps.notification

        const notificationDuration = notification ? notification.duration : null
        const prevNotificationDuration = prevNotification ? prevNotification.duration : null
        if (notificationDuration != prevNotificationDuration) {
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
        if (this.props.notification && this.props.notification.duration) {
            this.timeout = setTimeout( () => {
                    this.setState({display: false})
                },
                this.props.notification.duration
            )
        }
    }

    render() {
        let notification
        if (this.state.display && this.props.notification){
            const notificationClass = classNames(
                'notification',
                'message',
                this.props.notification.type
            )

            notification = (
                <div className="notified">
                    <div className={notificationClass}>
                        {this.props.notification.message}
                    </div>
                </div>
            )
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
