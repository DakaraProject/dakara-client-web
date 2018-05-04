import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from './ReactTransitionGroup'
import Delayer from './Delayer'
import { Status } from 'reducers/alterations'

export default class ListingFetchWrapper extends Component {
    static propTypes = {
        status: PropTypes.symbol,
    }

    render() {
        const { status } = this.props

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

                <CSSTransitionLazy
                    in={status === Status.failed}
                    classNames="notified"
                    appear={true}
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    <div className="notified">
                        <div className="notification danger message">
                            Unable to get results
                        </div>
                    </div>
                </CSSTransitionLazy>
                {pending}
            </div>
        )
    }
}
