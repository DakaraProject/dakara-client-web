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
                    <Field
                        id="old_password"
                        type="password"
                        label="Current password"
                        required
                    />
                    <Field
                        id="password"
                        type="password"
                        label="New password"
                        required
                    />
                </FormBlock>
            </div>
        )
    }
}

export default User
