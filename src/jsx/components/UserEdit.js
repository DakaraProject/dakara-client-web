import React, { Component } from 'react'
import { FormBlock, InputField, SelectField, CheckboxField } from '../components/Form.js'
import { browserHistory } from 'react-router'
import { BasePermission } from '../containers/BasePermission'
import { IsUserManager, IsNotSelf } from '../containers/UsersPermissions'


export default class UserEdit extends Component {

    componentWillMount() {
        const { authenticatedUser } = this.props
        const userId = this.props.params.userId
        const fakeUser = {id: userId}

        // check if the current user can disply the page
        if (!(BasePermission.hasPermission(authenticatedUser, fakeUser, IsUserManager) &&
                BasePermission.hasPermission(authenticatedUser, fakeUser, IsNotSelf))) {

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
                        <InputField
                            id="confirm_password"
                            type="password"
                            label="Confirm password"
                            validate={(value, values) => {
                                if (values.password != value) {
                                    return ["This field should match password field."]
                                }
                            }}
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
