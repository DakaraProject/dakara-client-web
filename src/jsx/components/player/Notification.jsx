import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Status } from 'reducers/alterationsStatus'
import PropTypes from 'prop-types'

const notificationTypes = {
    [Status.pending]: 'success',
    [Status.successful]: 'success',
    [Status.failed]: 'danger'
}

/**
 * Notification message
 */
export default class PlayerNotification extends Component {
    static propTypes = {
        alterationStatuses: PropTypes.arrayOf(PropTypes.shape({
            status: PropTypes.symbol,
            message: PropTypes.string,
        })).isRequired,
        playerErrors: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.any.isRequired,
            error_message: PropTypes.string.isRequired,
        })).isRequired,
    }

    state = {
        displayAlterationStatusId: null,
        displayPlayerError: false,
    }

    componentDidMount() {
        this.setNotificationClearTimeout()
    }

    componentDidUpdate(prevProps) {
        /**
         * Handle arterationStatus
         */

        const alterationStatuses = this.props.alterationStatuses
        const prevAlterationStatuses = prevProps.alterationStatuses

        // if the alterationStatuses prop has changed in length, throw an error
        if (alterationStatuses.length != prevAlterationStatuses.length) {
            throw new Error("Property alterationStatuses has changed")
        }

        // handle alterationStatuses changes
        for (let i = 0; i < alterationStatuses.length; i++) {
            const alterationsStatus = alterationStatuses[i]
            const prevAlterationStatus = prevAlterationStatuses[i]

            // check a new error has occured
            if (alterationsStatus.status != prevAlterationStatus.status &&
                alterationsStatus.status == Status.failed) {

                if (this.timeout) {
                    clearTimeout(this.timeout)
                }

                this.setState({
                    displayAlterationStatusId: i,
                    displayPlayerError: false,
                })
                this.setNotificationClearTimeout()

                // if an error has occured, leave now
                return
            }
        }

        /**
         * Handle player errors
         */

        const playerErrors = this.props.playerErrors
        const prevPlayerErrors = prevProps.playerErrors

        // check there is at least one element in the list
        if (playerErrors.length == 0) return

        // check the latest error has changed
        if (prevPlayerErrors.length == 0 ||
            playerErrors[playerErrors.length - 1].id !=
            prevPlayerErrors[prevPlayerErrors.length - 1].id) {

            if (this.timeout) {
                clearTimeout(this.timeout)
            }

            this.setState({
                displayAlterationStatusId: null,
                displayPlayerError: true,
            })
            this.setNotificationClearTimeout()
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    setNotificationClearTimeout = () => {
        this.timeout = setTimeout( () => {
                this.setState({
                    displayAlterationStatusId: null,
                    displayPlayerError: false,
                })
            },
            5000
        )
    }

    render() {
        const { displayAlterationStatusId, displayPlayerError } = this.state
        const { alterationStatuses, playerErrors } = this.props
        let notification
        let message
        let key
        if (displayAlterationStatusId != null) {
            message = alterationStatuses[displayAlterationStatusId].message
            key = displayAlterationStatusId
        } else if (displayPlayerError) {
            const playerError = playerErrors[playerErrors.length - 1]
            message = playerError.error_message
            key = playerError.id
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
                    <div className="notified" key={key}>
                        <div className="notification message danger">
                            {message}
                        </div>
                    </div>
                </CSSTransition>
            )
        }

        return (
            <TransitionGroup>
                {notification}
            </TransitionGroup>
        )
    }
}
