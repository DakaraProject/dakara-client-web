import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionLazy } from 'components/generics/ReactTransitionGroup'
import classNames from 'classnames'
import { FormInline, CheckboxField, HueField } from 'components/generics/Form'
import Notification, { NotifiableForTable } from 'components/generics/Notification'
import { IsLibraryManager } from 'components/permissions/Library'
import { Status, alterationResponsePropType } from 'reducers/alterationsResponse'
import { songTagPropType } from 'serverPropTypes/library'
import { userPropType } from 'serverPropTypes/users'

export default class SettingsSongTagsEntry extends Component {
    static propTypes = {
        tag: songTagPropType.isRequired,
        responseOfEdit: alterationResponsePropType,
        responseOfEditColor: alterationResponsePropType,
        editSongTag: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        authenticatedUser: userPropType.isRequired,
    }

    state = {
        colorFormDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearAlteration("editSongTag", this.props.tag.id)
    }

    displayColorForm = () => {
        this.setState({colorFormDisplayed: true})
    }

    clearColorForm = () => {
        this.setState({colorFormDisplayed: false})
    }

    render() {
        const { responseOfEdit, responseOfEditColor,
            authenticatedUser, tag, editSongTag } = this.props
        const isManager = IsLibraryManager.hasPermission(authenticatedUser)

        /**
         * Enableness status
         */

        const disabled = responseOfEdit && responseOfEdit.status === Status.pending
        const setValue = (id, value) => {
            if (!disabled)
                editSongTag(tag.id, !value)
        }

        // TODO It would be nice to set the checkbox to disabled if
        // the request (fetching) takes too much time.

        let enablenessWidget
        if (isManager) {
            enablenessWidget = (
                <div className="form inline">
                    <CheckboxField
                        id={`enabled-state${tag.id}`}
                        value={!tag.disabled}
                        setValue={setValue}
                        inline
                        toggle
                    />
                </div>
            )
        } else {
            enablenessWidget = (
                <i className="fa fa-check"></i>
            )
        }

        /**
         * Color
         */

        let colorWidget
        if (isManager) {
            colorWidget = (
                <div className="controls">
                    <button
                        className="control display-color"
                        onClick={this.displayColorForm}
                        style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                    >
                        <i className="fa fa-paint-brush"></i>
                    </button>
                </div>
            )
        } else {
            colorWidget = (
                <div className="display-color-container">
                    <div
                        className="display-color"
                        style={{filter: `hue-rotate(${tag.color_hue}deg)`}}
                    />
            </div>
            )
        }

        /**
         * Form to change color
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
                <td className={classNames(
                    "enableness",
                    {'controls-col': isManager}
                )}
                >
                    {enablenessWidget}
                </td>
                <td className="controls-col">
                    {colorWidget}
                </td>
            </tr>
        )
    }
}
