import PropTypes from 'prop-types'
import { Component } from 'react'

import { CSSTransitionLazy } from 'components/adapted/ReactTransitionGroup'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import ControlLink from 'components/generics/ControlLink'
import Notification, { NotifiableForTable } from 'components/generics/Notification'
import { IsNotSelf, IsUserManager } from 'components/permissions/Users'
import { alterationResponsePropType } from 'reducers/alterationsResponse'
import { userPropType } from 'serverPropTypes/users'

import Marked from './Marked'
import PermissionText from './PermissionText'

export default class SettingsUsersEntry extends Component {
    static propTypes = {
        clearAlteration: PropTypes.func.isRequired,
        deleteUser: PropTypes.func.isRequired,
        user: userPropType.isRequired,
        responseOfDelete: alterationResponsePropType,
    }

    state = {
        confirmDisplayed: false
    }

    componentWillUnmount() {
        this.props.clearAlteration('deleteUser', this.props.user.id)
    }

    displayConfirm = () => {
        this.setState({confirmDisplayed: true})
    }

    clearConfirm = () => {
        this.setState({confirmDisplayed: false})
    }

    render() {
        const { user, deleteUser } = this.props

        return (
            <tr className="listing-entry user-listing-entry hoverizable">
                <td className="notification-col">
                    <NotifiableForTable>
                        <CSSTransitionLazy
                            in={this.state.confirmDisplayed}
                            classNames="notified"
                            timeout={{
                                enter: 300,
                                exit: 150
                            }}
                        >
                            <ConfirmationBar
                                onConfirm={() => {deleteUser(user.id)}}
                                onCancel={this.clearConfirm}
                            />
                        </CSSTransitionLazy>
                        <Notification
                            alterationResponse={this.props.responseOfDelete}
                            pendingMessage="Deleting…"
                            successfulMessage="Successfuly deleted!"
                            successfulDuration={null}
                            failedMessage="Error attempting to delete user"
                        />
                    </NotifiableForTable>
                </td>
                <td className="username">{user.username}</td>
                <IsUserManager>
                    <td className="validated">
                        <Marked marked={user.validated_by_email}/>
                    </td>
                    <td className="validated">
                        <Marked marked={user.validated_by_manager}/>
                    </td>
                </IsUserManager>
                <td className="superuser">
                    <Marked marked={user.is_superuser}/>
                </td>
                <td className="permission">
                    <PermissionText level={user.users_permission_level}/>
                </td>
                <td className="permission">
                    <PermissionText level={user.library_permission_level}/>
                </td>
                <td className="permission last">
                    <PermissionText level={user.playlist_permission_level}/>
                </td>
                <td className="controls-col">
                    <IsUserManager>
                        <div className="controls">
                            <IsNotSelf
                                object={user}
                                disable
                            >
                                <ControlLink
                                    to={`${user.id}`}
                                    className="control info"
                                >
                                    <i className="las la-pen"></i>
                                </ControlLink>
                                <button
                                    className="control danger"
                                    onClick={this.displayConfirm}
                                >
                                    <i className="las la-trash"></i>
                                </button>
                            </IsNotSelf>
                        </div>
                    </IsUserManager>
                </td>
            </tr>
        )
    }
}
