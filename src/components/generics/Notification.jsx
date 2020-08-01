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
        alterationResponse: alterationResponsePropType,
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
        const alterationResponse = this.props.alterationResponse
        const prevAlterationResponse = prevProps.alterationResponse

        const status = alterationResponse?.status
        const prevStatus = prevAlterationResponse?.status
        const date = alterationResponse?.date
        const prevDate = prevAlterationResponse?.date
        if (status !== prevStatus || date !== prevDate) {
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
        const alterationResponse = this.props.alterationResponse
        const status = alterationResponse?.status
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
        if (this.state.display && this.props.alterationResponse) {
            const { status, message: messageInState, fields: fieldsInState } =
                this.props.alterationResponse

            let message

            // if there is a message in the state, keep it
            // otherwise, use the message passed to the compenent
            if (messageInState) {
                message = messageInState
            } else if (Object.keys(fieldsInState).length > 0) {
                message = "There are field errors."
            } else {
                const messages = {
                    [Status.pending]: this.props.pendingMessage,
                    [Status.successful]: this.props.successfulMessage,
                    [Status.failed]: this.props.failedMessage
                }

                message = messages[status]
            }

            // if there is no message to display, do not show any notification
            if (message) {
                notification = (
                    <CSSTransition
                        classNames="notified"
                        timeout={{
                            enter: 300,
                            exit: 150
                        }}
                    >
                        <div className="notified">
                            <div
                                className={classNames(
                                    'notification',
                                    notificationTypes[status]
                                )}
                            >
                                <div className="message">
                                    {message}
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                )
            }
        }

        return (
            <TransitionGroup className="notification-wrapper">
                {notification}
            </TransitionGroup>
        )
    }
}

/**
 * Helper to create a notifiable area in a table
 *
 * Must be used on the cell of the first column.
 */
export class NotifiableForTable extends Component {
    elementRef = React.createRef()

    state = {
        parentTableElement: null,
    }

    componentDidMount() {
        // find parent table DOM node
        const element = this.elementRef.current
        this.setState({parentTableElement: element.closest('table')})
    }

    render() {
        const { children, className } = this.props
        const { parentTableElement } = this.state

        // get the width of the element with the width of the closest table
        const width = parentTableElement?.clientWidth

        return (
            <div className="notifiable-for-table" ref={this.elementRef}>
                <div
                    className={classNames("notifiable", className)}
                    style={{width}}
                >
                    {children}
                </div>
            </div>
        )
    }
}
