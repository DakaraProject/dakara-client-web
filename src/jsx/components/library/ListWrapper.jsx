import React, { Component } from 'react'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import Delayer from 'components/generics/Delayer'

export default class ListWrapper extends Component {
    render() {
        const { isFetching, fetchError } = this.props

        let pending
        if (isFetching) {
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
                    in={fetchError}
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
