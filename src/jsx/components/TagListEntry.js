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

        return (
            <tr className="listing-entry hoverizable">
                <td className="name">{tag.name}</td>
                <td className="color">{tag.color_id}</td>
                <td className="disabled-state">
                    {tag.disabled ? 'false' : 'true'}
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
