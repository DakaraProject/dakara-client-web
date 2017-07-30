import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Delayer from './Delayer'

export default class LibraryListWrapper extends Component {
    render() {
        const { isFetching, fetchError } = this.props
        let notification
        if (fetchError) {
            notification = (
                <div className="notified">
                    <div className="notification danger message">
                        Unable to get results
                    </div>
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
            <div className="library-list-wrapper">
                <ReactCSSTransitionGroup
                    component="div"
                    className="notification-area notifiable"
                    transitionName="notified"
                    transitionAppear={true}
                    transitionEnterTimeout={150}
                    transitionAppearTimeout={150}
                    transitionLeaveTimeout={300}
                >
                    {notification}
                </ReactCSSTransitionGroup>

                {this.props.children}

                {pending}
            </div>
        )
    }
}