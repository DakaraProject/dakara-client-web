import React, { Component } from 'react'
import { FormBlock, InputField } from '../components/Form.js'

export const permissionLevels = {
    u: "user",
    m: "manager",
    p: "player"
}

class User extends Component {
    componentWillUnmount() {
        this.props.clearForm('updatePassword')
    }

    render() {
        const { user, updatePassword } = this.props
        let permissions = []

        // superuser
        if (user.is_superuser) {
            permissions.push((
                <p>You are super user.</p>
            ))
        }

        // users permission
        if (user.users_permission_level) {
            permissions.push((
                <p>You are users {permissionLevels[user.users_permission_level]}.</p>
            ))
        }

        // library permission
        if (user.library_permission_level) {
            permissions.push((
                <p>You are library {permissionLevels[user.library_permission_level]}.</p>
            ))
        }

        // playlist permission
        if (user.playlist_permission_level) {
            permissions.push((
                <p>You are playlist {permissionLevels[user.playlist_permission_level]}.</p>
            ))
        }

        return (
            <div className="box" id="user">
                <div className="header">
                    <h1>{user.username}</h1>
                </div>
                <div className="permissions">
                    {permissions}
                </div>
                <FormBlock
                    title="Change password"
                    onSubmit={values => {
                        updatePassword(user.id, values.old_password, values.password)
                    }}
                    submitText="Change password"
                    formName="updatePassword"
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
                    />
                </FormBlock>
            </div>
        )
    }
}

export default User
