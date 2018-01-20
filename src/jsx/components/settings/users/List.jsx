import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'
import { deleteUser, getUsers } from 'actions'
import { FormBlock, InputField } from 'components/generics/Form'
import Navigator from 'components/generics/Navigator'
import { IsUserManager } from 'components/permissions/Users'
import UserEntry from './Entry'

class UserList extends Component {
    componentWillMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        if (queryObj.page != prevqueryObj.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const queryObj = parse(this.props.location.search)
        const pageNumber = queryObj.page
        this.props.getUsers(pageNumber)
    }

    render() {
        const {deleteUser, entries, notifications, location } = this.props

        const userList = entries.data.results.map((user) => {
            let notification = notifications[user.id]

            return (
                <UserEntry
                    key={user.id}
                    user={user}
                    notification={notification}
                    deleteUser={deleteUser}
                />
            )
        })

        return (
            <div className="box" id="users-list">
                <div className="box-header">
                    <h1>Users management</h1>
                </div>
                <div className="listing-table-container">
                    <table className="listing users-list notifiable">
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
                <Navigator
                    data={entries.data}
                    location={location}
                />
                <IsUserManager>
                    <FormBlock
                        title="Create user"
                        submitText="Create"
                        formName="createUser"
                        action="users/"
                        successMessage="User sucessfully created!"
                        onSuccess={this.refreshEntries}
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
                            ignore
                        />
                    </FormBlock>
                </IsUserManager>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    entries: state.users.entries,
    notifications: state.users.notifications
})

UserList = withRouter(connect(
    mapStateToProps,
    { deleteUser, getUsers }
)(UserList))

export default UserList
