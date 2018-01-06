import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormBlock, InputField } from 'components/generics/Form'
import { permissionLevels } from 'components/permissions/Users'

class User extends Component {
    render() {
        const { user } = this.props
        let permissions = []

        // superuser
        if (user.is_superuser) {
            permissions.push((
                <p key="superuser">You are super user.</p>
            ))
        }

        // users permission
        if (user.users_permission_level) {
            permissions.push((
                <p key="users">You are users {permissionLevels[user.users_permission_level]}.</p>
            ))
        }

        // library permission
        if (user.library_permission_level) {
            permissions.push((
                <p key="library">You are library {permissionLevels[user.library_permission_level]}.</p>
            ))
        }

        // playlist permission
        if (user.playlist_permission_level) {
            permissions.push((
                <p key="playlist">You are playlist {permissionLevels[user.playlist_permission_level]}.</p>
            ))
        }

        return (
            <div className="box" id="user">
                <div className="box-header">
                    <h1>{user.username}</h1>
                    <div className="permissions">
                        {permissions}
                    </div>
                </div>
                <FormBlock
                    title="Change password"
                    onSubmit={values => {
                        updatePassword(user.id, values.old_password, values.password)
                    }}
                    action={`users/${user.id}/password/`}
                    method="PUT"
                    submitText="Change password"
                    formName="updatePassword"
                    successMessage="Password sucessfully updated!"
                >
                    <InputField
                        id="old_password"
                        type="password"
                        label="Current password"
                        required
                    />
                    <InputField
                        id="password"
                        type="password"
                        label="New password"
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
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authenticatedUsers,
})

User = connect(
    mapStateToProps,
)(User)

export default User
