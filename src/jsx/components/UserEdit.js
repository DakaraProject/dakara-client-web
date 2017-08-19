import React, { Component } from 'react'
import { FormBlock, InputField, SelectField } from '../components/Form.js'


export default class UserEdit extends Component {

    componentWillMount() {
        const userId = this.props.params.userId
        this.props.getUser(userId)
    }

    componentWillUnmount() {
        this.props.clearUser()
        this.props.clearForm('updateUser')
    }

    render() {
        const { location, updateUser, user } = this.props

        if (!user) {
            return null
        }

        return (
                <div className="box" id="user-edit">
                    <FormBlock
                        title={"Edit user " + user.username}
                        onSubmit={values => {
                            updateUser(user.id, values)
                        }}
                        submitText="Edit"
                        formName="updateUser"
                        noClearOnSuccess
                    >
                        <InputField
                            id="password"
                            type="password"
                            label="Password"
                        />
                        <SelectField
                            id="users_permission_level"
                            label="Users rights"
                            defaultValue={user.users_permission_level}
                            options={[
                                {value: '', name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                            ]}
                        />
                        <SelectField
                            id="library_permission_level"
                            label="Library rights"
                            defaultValue={user.library_permission_level}
                            options={[
                                {value: '', name: 'None'},
                                {value: 'u', name: 'User'},
                                {value: 'm', name: 'Manager'},
                            ]}
                        />
                        <SelectField
                            id="playlist_permission_level"
                            label="Playlist rights"
                            defaultValue={user.playlist_permission_level}
                            options={[
                                {value: '', name: 'None'},
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
