import React, { Component } from 'react'
import { connect } from 'react-redux'


/**
 * Base permission component
 */

class BasePermission extends Component {
    has_permission = () => {
        const { user } = this.props

        // if the user is not connected, access denied
        if (!user) {
            return false
        }

        // if the user is the superuser, all access granted
        if (user.is_superuser) {
            return true
        }

        // apply custom permission
        return this.has_permission_custom()
    }

    has_permission_custom = () => {
        return false
    }

    render() {
        const { children, disable } = this.props

        // if the user does not have the permission to display the children
        if (!this.has_permission()) {
            // if the children can be disabled, display them disabled
            if (disable) {
                // FIXME remove the div wrapper
                return (
                    <div>{React.Children.map(children, (child) => (
                    React.cloneElement(child, {disabled: true})
                    ))}</div>
                )
            }

            // else, do not display them at all
            return null
        }

        // otherwize, if the user has permission to display the children
        return this.props.children
    }
}

const mapStateToProps = (state) => ({
    user: state.users
})


/**
 * Playlist manager or Owner of the object
 */

export const IsPlaylistManagerOrOwner = connect(
    mapStateToProps
)(
    class extends BasePermission {
        has_permission_custom = () => {
            const { user, object } = this.props

            return (user.playlist_permission_level == 'm' ||
                user.id == object.owner.id)
        }
    }
)


/**
 * Playlist user or Playlist manager
 */

export const IsPlaylistUser = connect(
    mapStateToProps
)(
    class extends BasePermission {
        has_permission_custom = () => {
            const { user } = this.props

            return (user.playlist_permission_level == 'u' ||
                user.playlist_permission_level == 'm')
        }
    }
)
