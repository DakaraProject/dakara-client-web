import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { FormInline, CheckboxField, HueField } from 'components/generics/Form'
import Notification, { NotifiableForTable } from 'components/generics/Notification'
import { Status, alterationResponsePropType } from 'reducers/alterationsResponse'
import { songTagPropType } from 'serverPropTypes/library'

export default class SettingsSongTagsEntry extends Component {
    static propTypes = {
        tag: songTagPropType.isRequired,
        responseOfEdit: alterationResponsePropType,
        responseOfEditColor: alterationResponsePropType,
        editSongTag: PropTypes.func.isRequired,
        clearTagListEntryNotification: PropTypes.func.isRequired,
    }

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
        const { responseOfEdit, responseOfEditColor, tag, editSongTag } = this.props

        /**
         * form to change color
         */

        const submitText = (
            <span className="icon">
                <i className="fa fa-check"></i>
            </span>
        )

        const colorForm = (
            <div className="notified color-form-notified">
                <FormInline
                    action={`library/song-tags/${tag.id}/`}
                    method="PATCH"
                    submitText={submitText}
                    submitClass="success"
                    alterationName="editSongTagColor"
                    elementId={tag.id}
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

        /**
         * handle disabled state
         */

        const disabled = responseOfEdit && responseOfEdit.status == Status.pending
        const setValue = (id, value) => {
            if (!disabled)
                editSongTag(tag.id, !value)
        }

        // TODO It would be nice to set the checkbox to disabled if
        // the request (fetching) takes too much time.

        return (
            <tr className="listing-entry hoverizable">
                <td className="notification-col color">
                    <NotifiableForTable>
                        <Notification
                            alterationResponse={responseOfEdit}
                            failedMessage="Error attempting to edit tag"
                            pendingMessage={false}
                            successfulMessage={false}
                        />
                        <Notification
                            alterationResponse={responseOfEditColor}
                            successfulMessage={false}
                            pendingMessage={false}
                            failedMessage="Error attempting to edit tag color"
                        />
                        <CSSTransitionLazy
                            in={this.state.colorFormDisplayed}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            {colorForm}
                        </CSSTransitionLazy>
                    </NotifiableForTable>
                </td>
                <td className="name">{tag.name}</td>
                <td className="enabled controls-col">
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
                <td className="controls-col">
                    <div className="controls">
                        <button
                            className="control display-color-form"
                            onClick={this.displayColorForm}
                            style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                        >
                            <i className="fa fa-paint-brush"></i>
                        </button>
                    </div>
                </td>
            </tr>
        )
    }
}
