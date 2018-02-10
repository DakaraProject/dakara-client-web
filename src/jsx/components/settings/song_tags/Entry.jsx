import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import classNames from 'classnames'
import { FormInline, CheckboxField, HueField } from 'components/generics/Form'
import Notification from 'components/generics/Notification'
import { Status } from 'reducers/alterationsStatus'

export default class SongTagEntry extends Component {
    state = {
        colorFormDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearTagListEntryNotification(this.props.tag.id)
    }

    displayColorForm = () => {
        this.setState({colorFormDisplayed: true})
    }

    clearColorForm = () => {
        this.setState({colorFormDisplayed: false})
    }

    render() {
        const { editStatus, formResponse, tag, editSongTag } = this.props

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

        const disabled = editStatus && editStatus.status == Status.pending
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
                            id={`enabled-state${tag.id}`}
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
                    </ReactCSSTransitionGroup>
                    <Notification
                        alterationStatus={editStatus}
                        failedMessage="Error attempting to edit tag"
                        pendingMessage={false}
                        successfulMessage={false}
                    />
                    <Notification
                        alterationStatus={formResponse}
                        successfulMessage={false}
                        pendingMessage={false}
                        failedMessage="Error attempting to edit tag color"
                    />
                </td>
            </tr>
        )
    }
}
