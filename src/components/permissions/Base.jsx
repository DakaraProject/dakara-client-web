import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userPropType } from 'serverPropTypes/users'
import { mapStateToProps } from 'utils/permissions'

export class PermissionBase extends Component {
    static propTypes = {
        disable: PropTypes.bool,
        object: PropTypes.object,
        user: userPropType,
        children: PropTypes.node,
    }

    instanceHasPermission = () => {
        const { user, object } = this.props
        return this.constructor.hasPermission(
            user,
            object,
        )
    }

    static hasPermission(user, object) {
        // if the user is not connected, access denied
        if (!user) {
            return false
        }

        // if the user is the superuser, all access granted
        if (user.is_superuser) {
            return true
        }

        // apply custom permission
        return this.hasPermissionCustom(user, object)
    }

    static hasPermissionCustom(user, object) {
        return false
    }

    render() {
        const { children, disable } = this.props

        // if the user has permission to display the children
        if (this.instanceHasPermission()) return children

        // if the children can be disabled, display them disabled
        if (disable) {
            const childrenToProcess = React.Children.count(children) > 1 ?
                children : [children]

            return React.Children.map(childrenToProcess, (child) => (
                React.cloneElement(child, {disabled: true})
            ))
        }

        // else, do not display them at all
        return null

    }
}

/**
 * Is authenticated
 */

export const IsAuthenticated = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user) {
            return true
        }
    }
)
