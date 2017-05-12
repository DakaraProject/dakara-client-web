import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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

                {this.props.children}
            </div>
        )
    }
}

export default LibraryListOverlay
