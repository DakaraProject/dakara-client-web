import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { clearUser, getUser } from 'actions/users'
import { CheckboxField, FormBlock, InputField, SelectField } from 'components/generics/Form'
import Forbidden from 'components/navigation/Forbidden'
import NotFound from 'components/navigation/NotFound'
import { IsNotSelf, IsUserManager } from 'components/permissions/Users'
import SettingsTabList from 'components/settings/TabList'
import { Status } from 'reducers/alterationsResponse'
import { editUsersStatePropType } from 'reducers/users'
import { userPropType } from 'serverPropTypes/users'

class SettingsUsersEdit extends Component {
    static propTypes = {
        editUsersState: editUsersStatePropType.isRequired,
        authenticatedUser: userPropType.isRequired,
        location: PropTypes.object.isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                userId: PropTypes.any.isRequired,
            }).isRequired,
        }).isRequired,
        getUser: PropTypes.func.isRequired,
        clearUser: PropTypes.func.isRequired,
        serverSettings: PropTypes.object
    }

    componentDidMount() {
        const userId = this.props.match.params.userId
        this.props.getUser(userId)
    }

    componentWillUnmount() {
        this.props.clearUser()
    }

    render() {
        const { location, authenticatedUser, serverSettings } = this.props
        const { user } = this.props.editUsersState.data

        // render nothing if the user is being fetched
        if (this.props.editUsersState.status === Status.pending) {
            return null
        }

        // render an error page if the current user has no right to display the page
        const userId = this.props.match.params.userId
        const fakeUser = {id: userId}
        if (!(IsUserManager.hasPermission(authenticatedUser, fakeUser) &&
                IsNotSelf.hasPermission(authenticatedUser, fakeUser))) {

            return (
                <Forbidden location={location}/>
            )
        }

        // render an error page if the requested user does not exist
        if (!user) {
            return (
                <NotFound location={location}/>
            )
        }

        let passwordField
        let passwordConfirmField
        if (serverSettings && !serverSettings.email_enabled) {
            passwordField = (
                <InputField
                    id="password"
                    type="password"
                    label="Password"
                    ignoreIfEmpty
                />
            )
            passwordConfirmField = (
                <InputField
                    id="confirm_password"
                    type="password"
                    label="Confirm password"
                    validate={(value, values) => {
                        if (values.password !== value) {
                            return ["This field should match password field."]
                        }
                    }}
                    ignore
                />
            )
        }

        return (
                <div className="box" id="users-edit">
                    <SettingsTabList/>
                    <FormBlock
                        title={`Edit user “${user.username}”`}
                        action={`users/${user.id}/`}
                        method="PATCH"
                        submitText="Edit"
                        alterationName="updateUser"
                        successMessage="User sucessfully updated!"
                        noClearOnSuccess
                    >
                        <InputField
                            id="username"
                            label="Username"
                            defaultValue={user.username}
                            disabled
                            ignore
                        />
                        <InputField
                            id="email"
                            label="E-mail"
                            defaultValue={user.email}
                            disabled
                            ignore
                        />
                        {passwordField}
                        {passwordConfirmField}
                        <CheckboxField
                            id="validated_by_email"
                            label="Validated by email"
                            defaultValue={user.validated_by_email}
                            disabled
                            ignore
                        />
                        <CheckboxField
                            id="validated_by_manager"
                            label="Validated by manager"
                            defaultValue={user.validated_by_manager}
                        />
                        <CheckboxField
                            id="is_superuser"
                            label="Superuser"
                            defaultValue={user.is_superuser}
                            disabled
                            ignore
                        />
                        <SelectField
                            id="users_permission_level"
                            label="Users rights"
                            defaultValue={user.users_permission_level}
                            options={[
                                {value: null, name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                            ]}
                        />
                        <SelectField
                            id="library_permission_level"
                            label="Library rights"
                            defaultValue={user.library_permission_level}
                            options={[
                                {value: null, name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                            ]}
                        />
                        <SelectField
                            id="playlist_permission_level"
                            label="Playlist rights"
                            defaultValue={user.playlist_permission_level}
                            options={[
                                {value: null, name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                                {value: 'p', name: 'Player'}
                            ]}
                        />
                    </FormBlock>
                </div>
        )
    }
}

const mapStateToProps = (state) => ({
    editUsersState: state.settings.users.edit,
    authenticatedUser: state.authenticatedUser,
    serverSettings: state.internal.serverSettings
})

SettingsUsersEdit = connect(
    mapStateToProps,
    {
        getUser,
        clearUser,
    }
)(SettingsUsersEdit)

export default SettingsUsersEdit
