import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Delayer from './Delayer'

class LibraryListOverlay extends Component {
    render() {
        const { isFetching, fetchError } = this.props
        let notification
        if (fetchError) {
            notification = (
                <div className="notified notification danger">
                    Error !
                </div>
            )
        }

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
            <div className="library-overlay">
                <div className="notification-area">
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionAppear={true}
                        transitionEnterTimeout={150}
                        transitionAppearTimeout={150}
                        transitionLeaveTimeout={300}
                    >
                        {notification}
                    </ReactCSSTransitionGroup>
                </div>

                {pending}

                {this.props.children}
            </div>
        )
    }
}

export default LibraryListOverlay
