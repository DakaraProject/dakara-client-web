import PropTypes from 'prop-types'
import { parse } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { deleteUser, getUsers } from 'actions/users'
import { FormBlock, InputField } from 'components/generics/Form'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import { withLocation } from "components/generics/Router"
import { IsUserManager } from 'components/permissions/Users'
import SettingsUserEntry from 'components/settings/users/Entry'
import { listUsersStatePropType } from 'reducers/users'

class UsersList extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        listUsersState: listUsersStatePropType.isRequired,
        responseOfMultipleDeleteUser: PropTypes.object,
        deleteUser: PropTypes.func.isRequired,
        clearAlteration: PropTypes.func.isRequired,
        getUsers: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        if (queryObj.page !== prevqueryObj.page) {
            this.refreshEntries()
        }
    }

    refreshEntries = () => {
        const queryObj = parse(this.props.location.search)
        const pageNumber = queryObj.page
        this.props.getUsers(pageNumber)
    }

    render() {
        const { deleteUser, clearAlteration, location,
            responseOfMultipleDeleteUser } = this.props
        const { users, pagination } = this.props.listUsersState.data

        const userList = users.map((user) => (
            <SettingsUserEntry
                key={user.id}
                user={user}
                responseOfDelete={responseOfMultipleDeleteUser[user.id]}
                deleteUser={deleteUser}
                clearAlteration={clearAlteration}
            />
        ))

        return (
            <div id="users-list">
                <ListingFetchWrapper
                    status={this.props.listUsersState.status}
                >
                    <div className="listing-table-container">
                        <table className="listing users-list notifiable">
                            <thead>
                                <tr className="listing-header">
                                    <th className="notification-col"></th>
                                    <th className="username">User&shy;name</th>
                                    <IsUserManager>
                                        <th className="validated">Email check</th>
                                        <th className="validated">Manager check</th>
                                    </IsUserManager>
                                    <th className="superuser">Super&shy;user</th>
                                    <th className="permission">Users rights</th>
                                    <th className="permission">Library rights</th>
                                    <th className="permission">Playlist rights</th>
                                    <th className="controls-col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList}
                            </tbody>
                        </table>
                    </div>
                </ListingFetchWrapper>
                <Navigator
                    pagination={pagination}
                    location={location}
                />
                <IsUserManager>
                    <div className="content">
                        <FormBlock
                            title="Create user"
                            submitText="Create"
                            alterationName="createUser"
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
                                id="email"
                                label="Email"
                                required
                                validate={(value) => {
                                    if(!/\S+@\S+\.\S+/.test(value.toLowerCase())) {
                                        return ["This should be a valid email address."]
                                    }
                                }}
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
                                    if (values.password !== value) {
                                        return [
                                            "This field should match password field."
                                        ]
                                    }
                                }}
                                ignore
                            />
                        </FormBlock>
                    </div>
                </IsUserManager>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    listUsersState: state.settings.users.list,
    responseOfMultipleDeleteUser: state.alterationsResponse.multiple.deleteUser || {}
})

UsersList = withLocation(connect(
    mapStateToProps,
    {
        deleteUser,
        getUsers,
        clearAlteration
    }
)(UsersList))

export default UsersList
