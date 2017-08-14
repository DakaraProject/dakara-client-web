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

        return (
            <div className="box">
                <div>
                    Username: { user.username }
                    superUser:{ user.is_superuser ? 'true': 'false' }
                    user app level :{ permissionLevels[user.users_permission_level] }
                    library app level :{permissionLevels[user.library_permission_level] }
                    playlist app level :{ permissionLevels[user.playlist_permission_level] }
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
