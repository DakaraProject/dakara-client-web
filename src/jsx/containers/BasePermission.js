import React, { Component } from 'react'
import { connect } from 'react-redux'


export class BasePermission extends Component {
    _hasPermission = () => {
        const { user, object } = this.props
        return this.constructor.hasPermission(
            user,
            object,
            this.constructor
        )
    }

    static hasPermission(user, object, permissionClass) {
        // if the user is not connected, access denied
        if (!user) {
            return false
        }

        // if the user is the superuser, all access granted
        if (user.is_superuser) {
            return true
        }

        // apply custom permission
        return permissionClass.hasPermissionCustom(user, object)
    }

    static hasPermissionCustom(user, object) {
        return false
    }

    render() {
        const { children, disable } = this.props

        if (React.Children.count(children) > 1) {
            throw new Error("Permission component should only have one child")
        }

        // if the user does not have the permission to display the children
        if (!this._hasPermission()) {
            // if the children can be disabled, display them disabled
            if (disable) {
                return React.cloneElement(React.Children.only(children), {disabled: true})
            }

            // else, do not display them at all
            return null
        }

        // otherwize, if the user has permission to display the children
        return children
    }
}

export const mapStateToProps = (state) => ({
    user: state.authenticatedUsers
})
