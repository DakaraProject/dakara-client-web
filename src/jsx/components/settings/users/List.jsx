import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import { deleteUser, getUsers, clearUsersEntryNotification } from 'actions/users'
import { FormBlock, InputField } from 'components/generics/Form'
import Navigator from 'components/generics/Navigator'
import { IsUserManager } from 'components/permissions/Users'
import SettingsUserEntry from './Entry'
import SettingsTabList from '../TabList'
import { listUsersStatePropType } from 'reducers/users'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'

class SettingsUsersList extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        listUsersState: listUsersStatePropType.isRequired,
        statusDeleteUserList: PropTypes.object,
        deleteUser: PropTypes.func.isRequired,
        clearUsersEntryNotification: PropTypes.func.isRequired,
        getUsers: PropTypes.func.isRequired,
    }

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
        const { statusDeleteUserList, location } = this.props
        const { users, pagination } = this.props.listUsersState.data

        const userList = users.map((user) => {
            let statusDelete
            if (statusDeleteUserList) {
                statusDelete = statusDeleteUserList[user.id]
            }

            return (
                <SettingsUserEntry
                    key={user.id}
                    user={user}
                    statusDelete={statusDelete}
                    deleteUser={this.props.deleteUser}
                    clearUsersEntryNotification={this.props.clearUsersEntryNotification}
                />
            )
        })

        return (
            <div className="box" id="users-list">
                <SettingsTabList/>
                <div className="box-header">
                    <h1>Users management</h1>
                </div>
                <ListingFetchWrapper
                    status={this.props.listUsersState.status}
                >
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
                </ListingFetchWrapper>
                <Navigator
                    pagination={pagination}
                    location={location}
                />
                <IsUserManager>
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
    listUsersState: state.settings.users.list,
    statusDeleteUserList: state.alterations.multiple.deleteUser
})

SettingsUsersList = withRouter(connect(
    mapStateToProps,
    {
        deleteUser,
        getUsers,
        clearUsersEntryNotification
    }
)(SettingsUsersList))

export default SettingsUsersList
