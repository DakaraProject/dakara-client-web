import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class TagListEntry extends Component {
    render() {
        const { notification, tag } = this.props

        let message
        if (notification) {
            message = <div className="notified">
                        <div className={"notification message " + notification.type}>
                            {notification.message}
                        </div>
                      </div>
        }

        /**
         * enabled marker
         */
        let enabledMarker
        if (!tag.disabled) {
            enabledMarker = (
                <i className="fa fa-check"></i>
            )
        }

        return (
            <tr className="listing-entry tag-list-listing hoverizable">
                <td className="name">{tag.name}</td>
                <td className="color">
                    <span className={"tag color-" + tag.color_id}>
                        {tag.color_id}
                    </span>
                </td>
                <td className="enabled">
                    {enabledMarker}
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {message}
                    </ReactCSSTransitionGroup>
                </td>
            </tr>
        )
    }
}
