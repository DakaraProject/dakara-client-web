import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Link } from 'react-router'
import { FormBlock, InputField } from '../components/Form'
import Paginator from './Paginator'
import { permissionLevels } from './User'

class Users extends Component {
    componentWillUnmount() {
        this.props.clearForm('createUser')
    }

    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.query.page != prevProps.location.query.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const pageNumber = this.props.location.query.page
        this.props.getUsers(pageNumber)
    }

    render() {
        const { createUser, deleteUser, entries, notifications, location } = this.props
        const { current, last } = entries.data

        const userList = entries.data.results.map((entry) => {
            let message
            let notification = notifications[entry.id]
            if (notification) {
                message = <div className="notified">
                            <div className={"notification message " + notification.type}>
                                {notification.message}
                            </div>
                          </div>
            }

            return (
                <tr className="listing-entry user-listing-entry hoverizable" key={entry.id}>
                    <td className="username">{entry.username}</td>
                    <td className="permission superuser">{entry.is_superuser ? "✓" : null}</td>
                    <td className="permission">{permissionLevels[entry.users_permission_level]}</td>
                    <td className="permission">{permissionLevels[entry.library_permission_level]}</td>
                    <td className="permission">{permissionLevels[entry.playlist_permission_level]}</td>
                    <td className="controls-col">
                        <div className="controls">
                            <Link
                                to={"/users/" + entry.id}
                                className="control info"
                            >
                                <i className="fa fa-pencil"></i>
                            </Link>
                            <button
                                className="control danger"
                                onClick={e => {deleteUser(entry.id)}}
                            >
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
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
        })

        return (
            <div className="box" id="users">
                <div className="header">
                    <h1>Users management</h1>
                </div>
                <div className="users-listing-container">
                    <table className="listing users-listing notifiable">
                        <thead>
                            <tr className="listing-header">
                                <th className="username">Username</th>
                                <th className="permission">Is superuser</th>
                                <th className="permission">Users rights</th>
                                <th className="permission">Library rights</th>
                                <th className="permission">Playlist rights</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList}
                        </tbody>
                    </table>
                </div>
                <div className="navigator">
                    <Paginator
                        location={location}
                        current={current}
                        last={last}
                    />
                </div>
                <FormBlock
                    title="Create user"
                    onSubmit={formValues => {
                        createUser(formValues.username, formValues.password)
                    }}
                    submitText="Create"
                    formName="createUser"
                >
                    <InputField
                        id="username"
                        label="Username"
                        required
                    />
                    <InputField
                        id="password"
                        type="password"
                        label="Password"
                        required
                    />
                    <InputField
                        id="confirm_password"
                        type="password"
                        label="Confirm password"
                        required
                        validate={(value, values) => {
                            if (values.password != value) {
                                return ["This field should match password field."]
                            }
                        }}
                    />
                </FormBlock>
            </div>
        )
    }
}

export default Users
