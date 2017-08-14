import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormBlock, Field } from '../components/Form'
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
        const { createUser, deleteUser, formResponse, entries, notifications, location } = this.props
        const { current, last } = entries.data
        let username, password

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
                <tr className="listing-entry notifiable" key={entry.id}>
                    <td>{entry.username}</td>
                    <td>{entry.is_superuser ? "✓" : null}</td>
                    <td>{permissionLevels[entry.users_permission_level]}</td>
                    <td>{permissionLevels[entry.library_permission_level]}</td>
                    <td>{permissionLevels[entry.playlist_permission_level]}</td>
                    <td className="controls">
                        <button
                            className="control danger"
                            onClick={e => {deleteUser(entry.id)}}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
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
                <table className="listing">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Superuser</th>
                            <th>Users app</th>
                            <th>Library app</th>
                            <th>Playlist app</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList}
                    </tbody>
                </table>
                <Paginator
                    location={location}
                    current={current}
                    last={last}
                />
                <FormBlock
                    title="Create user"
                    onSubmit={e => {
                        e.preventDefault()
                        createUser(username.value, password.value)
                    }}
                    submitText="Create"
                    response={formResponse}
                >
                    <Field
                        id="username"
                        reference={n => {username = n}}
                        label="Username"
                        response={formResponse}
                    />
                    <Field
                        id="password"
                        reference={n => {password = n}}
                        type="password"
                        label="Password"
                        response={formResponse}
                    />
                </FormBlock>
            </div>
        )
    }
}

export default Users
