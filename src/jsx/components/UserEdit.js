import React, { Component } from 'react'
import { FormBlock, Field } from '../components/Form.js'


export default class UserEdit extends Component {

    componentWillMount() {
        const userId = this.props.params.userId
        this.props.getUser(userId)
    }

    componentWillUnmount() {
        this.props.clearUser()
    }

    render() {
        const { location, formResponse, updateUser, user } = this.props

        if (!user) {
            return null
        }

        return (
                <div className="box" id="user-edit">
                    <FormBlock
                        title={"Edit " + user.username}
                        response={formResponse}
                        onSubmit={values => {
                            updateUser(user.id, values)
                        }}
                        submitText="Edit"
                        noClearOnSuccess
                    >
                        <Field
                            id="password"
                            type="password"
                            label="Password"
                        />
                        <Field
                            id="users_permission_level"
                            label="Users rights"
                            defaultValue={user.users_permission_level}
                        />
                        <Field
                            id="library_permission_level"
                            label="Library rights"
                            defaultValue={user.library_permission_level}
                        />
                        <Field
                            id="playlist_permission_level"
                            label="Playlist rights"
                            defaultValue={user.playlist_permission_level}
                        />
                    </FormBlock>
                </div>
        )
    }
}
