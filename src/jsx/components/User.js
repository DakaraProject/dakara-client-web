import React, { Component } from 'react'
import { FormBlock, Field } from '../components/Form.js'

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
        const { user, formResponse, updatePassword } = this.props
        let oldPassword, newPassword
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
                    onSubmit={e => {
                        e.preventDefault()
                        updatePassword(user.id, oldPassword.value, newPassword.value)
                    }}
                    submitText="Change password"
                    response={formResponse}
                >
                    <Field
                        id="old_password"
                        reference={n => {oldPassword = n}}
                        type="password"
                        label="Current password"
                        response={formResponse}
                    />
                    <Field
                        id="password"
                        reference={n => {newPassword = n}}
                        type="password"
                        label="New password"
                        response={formResponse}
                    />
                </FormBlock>
            </div>
        )
    }
}

export default User
