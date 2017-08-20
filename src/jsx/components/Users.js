import React, { Component } from 'react'
import { FormBlock, InputField } from '../components/Form'
import Paginator from './Paginator'
import { IsUserManager } from '../containers/UsersPermissions'
import UsersEntry from './UsersEntry'

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

        const userList = entries.data.results.map((user) => {
            let notification = notifications[user.id]

            return (
                <UsersEntry
                    key={user.id}
                    user={user}
                    notification={notification}
                    deleteUser={deleteUser}
                />
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
                <IsUserManager>
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
                </IsUserManager>
            </div>
        )
    }
}

export default Users
