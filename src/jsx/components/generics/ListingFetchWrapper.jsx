import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from './ReactTransitionGroup'
import Delayer from './Delayer'
import Notification from './Notification'
import { Status } from 'reducers/alterationsResponse'

export default class ListingFetchWrapper extends Component {
    static propTypes = {
        status: PropTypes.symbol,
    }

    render() {
        const { status } = this.props
        const alterationStatus = {status}

        let pending
        if (status === Status.pending) {
            pending = (
                <Delayer delay={200}>
                    <div className="overlay">
                        <p className="pending">
                            Fetching...
                        </p>
                    </div>
                </Delayer>
            )
        }

        return (
            <div className="listing-fetch-wrapper notifiable">
                {this.props.children}

                <Notification
                    alterationStatus={alterationStatus}
                    pendingMessage={false}
                    successfulMessage={false}
                    failedMessage="Unable to get results"
                    failedDuration={null}
                />
                {pending}
            </div>
        )
    }
}
