import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { getUser, clearUser } from 'actions'
import { FormBlock, InputField, SelectField, CheckboxField } from 'components/generics/Form'
import { PermissionBase } from 'components/permissions/Base'
import { IsUserManager, IsNotSelf } from 'components/permissions/Users'

class UserEdit extends Component {
    componentWillMount() {
        const { authenticatedUser } = this.props
        const userId = this.props.params.userId
        const fakeUser = {id: userId}

        // check if the current user can disply the page
        if (!(PermissionBase.hasPermission(authenticatedUser, fakeUser, IsUserManager) &&
                PermissionBase.hasPermission(authenticatedUser, fakeUser, IsNotSelf))) {

            const { pathname, search } = this.props.location
            browserHistory.replace({
                pathname: "/403",
                query: {
                    from: pathname + search
                }
            })

            return
        }

        this.props.getUser(userId)
    }

    componentWillUnmount() {
        this.props.clearUser()
    }

    render() {
        const { location, user } = this.props

        if (!user) {
            return null
        }

        return (
                <div className="box" id="users-edit">
                    <FormBlock
                        title={"Edit user " + user.username}
                        action={"users/" + user.id + "/"}
                        method="PATCH"
                        submitText="Edit"
                        formName="updateUser"
                        successMessage="User sucessfully updated!"
                        noClearOnSuccess
                    >
                        <InputField
                            id="password"
                            type="password"
                            label="Password"
                            ignoreIfEmpty
                        />
                        <InputField
                            id="confirm_password"
                            type="password"
                            label="Confirm password"
                            validate={(value, values) => {
                                if (values.password != value) {
                                    return ["This field should match password field."]
                                }
                            }}
                            ignore
                        />
                        <CheckboxField
                            id="is_superuser"
                            label="Superuser"
                            defaultValue={user.is_superuser}
                            disabled
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
    user: state.users.userEdit,
    authenticatedUser: state.authenticatedUsers
})

UserEdit = connect(
    mapStateToProps,
    { getUser, clearUser }
)(UserEdit)

export default UserEdit
