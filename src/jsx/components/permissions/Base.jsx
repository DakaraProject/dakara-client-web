import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { userPropType } from 'serverPropTypes/users'

export class PermissionBase extends Component {
    static propTypes = {
        user: userPropType, // TODO should be isRequired
        object: PropTypes.object,
        disable: PropTypes.bool,
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

export const mapStateToProps = (state) => ({
    user: state.authenticatedUser
})

/**
 * Is authenticated
 */

export const IsAuthenticated = withRouter(connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user) {
            return true
        }
    }
))
