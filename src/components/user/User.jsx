import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { FormBlock, InputField } from 'components/generics/Form'
import { permissionLevels } from 'components/permissions/Users'
import { userPropType } from 'serverPropTypes/users'

class User extends Component {
    static propTypes = {
        user: userPropType.isRequired,
    }

    render() {
        const { user } = this.props
        let permissions = []

        // superuser
        if (user.is_superuser) {
            permissions.push((
                <p
                    key="superuser"
                >
                    You are super user.
                </p>
            ))
        }

        // users permission
        if (user.users_permission_level) {
            permissions.push((
                <p
                    key="users"
                >
                    You are users {permissionLevels[user.users_permission_level]}.
                </p>
            ))
        }

        // library permission
        if (user.library_permission_level) {
            permissions.push((
                <p
                    key="library"
                >
                    You are library {permissionLevels[user.library_permission_level]}.
                </p>
            ))
        }

        // playlist permission
        if (user.playlist_permission_level) {
            permissions.push((
                <p
                    key="playlist"
                >
                    You are playlist {permissionLevels[user.playlist_permission_level]}.
                </p>
            ))
        }

        return (
            <div className="box" id="user">
                <div className="header">
                    <h1>{user.username}</h1>
                    <div className="permissions">
                        {permissions}
                    </div>
                </div>
                <div className="content">
                    <FormBlock
                        title="Change password"
                        action={`users/${user.id}/password/`}
                        method="PUT"
                        submitText="Change password"
                        alterationName="updatePassword"
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
                                if (values.password !== value) {
                                    return ["This field should match password field."]
                                }
                            }}
                            ignore
                        />
                    </FormBlock>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authenticatedUser,
})

User = withRouter(connect(
    mapStateToProps,
)(User))

export default User
