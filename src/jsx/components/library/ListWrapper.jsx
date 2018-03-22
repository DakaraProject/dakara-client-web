import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import Delayer from 'components/generics/Delayer'
import { Status } from 'reducers/alterationsStatus'

export default class ListWrapper extends Component {
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
                        <div className="pending">
                            Fetching...
                        </div>
                    </div>
                </Delayer>
            )
        }

        return (
            <div className="library-list-wrapper notifiable">
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
