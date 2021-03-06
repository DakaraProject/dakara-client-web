import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FormBlock, InputField } from 'components/generics/Form'
import { permissionLevels } from 'components/permissions/Users'
import { userPropType } from 'serverPropTypes/users'

class User extends Component {
    static propTypes = {
        user: userPropType.isRequired,
        serverSettings: PropTypes.object
    }

    render() {
        const { user, serverSettings } = this.props
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
                        action="accounts/change-password/"
                        method="POST"
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
                            id="password_confirm"
                            type="password"
                            label="Confirm password"
                            required
                            validate={(value, values) => {
                                if (values.password !== value) {
                                    return ["This field should match password field."]
                                }
                            }}
                        />
                    </FormBlock>
                    <FormBlock
                        title="Change email"
                        action="accounts/register-email/"
                        method="POST"
                        submitText="Change email"
                        alterationName="registerEmail"
                        successMessage={serverSettings?.email_enabled ? "Validation email sent to you new address!" : "Email successfuly changed!"}
                    >
                        <InputField
                            id="email"
                            label="New email"
                            required
                            validate={(value) => {
                                if(!/\S+@\S+\.\S+/.test(value.toLowerCase())) {
                                    return ["This should be a valid email address."]
                                }
                            }}
                        />
                    </FormBlock>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authenticatedUser,
    serverSettings: state.internal.serverSettings
})

User = withRouter(connect(
    mapStateToProps,
)(User))

export default User
