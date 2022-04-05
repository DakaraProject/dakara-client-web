import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'
import { playerErrorPropType } from 'serverPropTypes/playlist'

/**
 * Notification message for the player
 */
export default class PlayerNotification extends Component {
    static propTypes = {
        alterationsResponse: PropTypes.objectOf(alterationResponsePropType).isRequired,
        playerErrors: PropTypes.arrayOf(playerErrorPropType).isRequired,
    }

    state = {
        displayAlterationResponseId: null,
        displayPlayerErrorId: null,
    }

    componentDidMount() {
        this.setNotificationClearTimeout()
    }

    componentDidUpdate(prevProps) {
        /**
         * Handle alterationStatus
         */

        const alterationsResponse = this.props.alterationsResponse
        const prevAlterationsResponse = prevProps.alterationsResponse

        // if the alterationsResponse prop has changed in length, throw an error
        if (
            Object.keys(alterationsResponse).length !==
            Object.keys(prevAlterationsResponse).length) {
            throw new Error('Property alterationsResponse has changed')
        }

        // handle alterationsResponse changes
        for (let id in alterationsResponse) {
            const alterationResponse = alterationsResponse[id]

            // check a new error has occured
            if (alterationResponse.status !== prevAlterationsResponse.status &&
                alterationResponse.status === Status.failed) {

                if (this.timeout) {
                    clearTimeout(this.timeout)
                }

                this.setState({
                    displayAlterationResponseId: id,
                    displayPlayerErrorId: null,
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
        if (playerErrors.length === 0) return

        // check the latest error has changed
        if (prevPlayerErrors.length === 0 ||
            playerErrors[playerErrors.length - 1].playlist_entry.id !==
            prevPlayerErrors[prevPlayerErrors.length - 1].playlist_entry.id) {

            if (this.timeout) {
                clearTimeout(this.timeout)
            }

            this.setState({
                displayAlterationResponseId: null,
                displayPlayerErrorId:
                    playerErrors[playerErrors.length - 1].playlist_entry.id,
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
                    displayAlterationResponseId: null,
                    displayPlayerErrorId: null,
                })
            },
            5000
        )
    }

    render() {
        const { displayAlterationResponseId, displayPlayerErrorId } = this.state
        const { alterationsResponse, playerErrors } = this.props

        let message
        let key
        if (displayAlterationResponseId !== null) {
            key = displayAlterationResponseId
            message = alterationsResponse[key].message
        } else if (displayPlayerErrorId !== null) {
            // take the latest playerError
            const playerError = playerErrors[playerErrors.length - 1]
            key = displayPlayerErrorId
            message = playerError.error_message
        }

        // if there is no message to display, do not show any notification
        let notification
        if (message) {
            notification = (
                <CSSTransition
                    classNames="notified"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                    key={key}
                >
                    <div className="notified">
                        <div className="notification danger">
                            <div className="message">
                                {message}
                            </div>
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
