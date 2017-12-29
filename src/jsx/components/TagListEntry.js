import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormInline, CheckboxField, HueField } from './Form'

export default class TagListEntry extends Component {
    state = {
        colorFormDisplayed: false
    }

    displayColorForm = () => {
        this.setState({colorFormDisplayed: true})
    }

    clearColorForm = () => {
        this.setState({colorFormDisplayed: false})
    }

    render() {
        const { notification, formNofitication, tag, editSongTag } = this.props

        /**
         * notification message
         */
        const getMessage = (notification) => (
            <div className="notified">
                <div className={"notification message " + notification.type}>
                    {notification.message}
                </div>
            </div>
        )

        let message
        if (notification && notification.message) {
            message = getMessage(notification)
        } else if (formNofitication && formNofitication.message) {
            message = getMessage(formNofitication)
        }

        /**
         * form to change color
         */
        let colorForm
        if (this.state.colorFormDisplayed) {
            const submitText = (
                <span className="icon">
                    <i className="fa fa-check"></i>
                </span>
            )

            colorForm = (
                <div className="notified color-form-notified">
                    <FormInline
                        action={`library/song-tags/${tag.id}/`}
                        method="PATCH"
                        submitText={submitText}
                        submitClass="success"
                        formName={`tagColorEdit${tag.id}`}
                        noClearOnSuccess
                        onSuccess={this.clearColorForm}
                        successMessage
                    >
                        <HueField
                            id="color_hue"
                            defaultValue={tag.color_hue}
                        />
                    </FormInline>
                    <div className="controls">
                        <button
                            onClick={this.clearColorForm}
                            className="control danger"
                        >
                            <span className="icon">
                                <i className="fa fa-times"></i>
                            </span>
                        </button>
                    </div>
                </div>
            )
        }

        /**
         * handle disabled state
         */
        const disabled = notification && notification.isFetching
        const setValue = (id, value) => {
            if (!disabled)
                editSongTag(tag.id, !value)
        }

        // TODO It would be nice to set the checkbox to disabled if
        // the request (fetching) takes too much time.


        return (
            <tr className="listing-entry hoverizable">
                <td className="name">{tag.name}</td>
                <td className="enabled">
                    <div className="form inline">
                        <CheckboxField
                            id={"enabled-state" + tag.id}
                            value={!tag.disabled}
                            setValue={setValue}
                            inline
                            toggle
                        />
                    </div>
                </td>
                <td className="color controls-col">
                    <div className="controls">
                        <button
                            className="control display-color-form"
                            onClick={this.displayColorForm}
                            style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                        >
                            <i className="fa fa-paint-brush"></i>
                        </button>
                    </div>
                    <ReactCSSTransitionGroup
                        transitionName="notified"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={150}
                    >
                        {colorForm}
                        {message}
                    </ReactCSSTransitionGroup>
                </td>
            </tr>
        )
    }
}
