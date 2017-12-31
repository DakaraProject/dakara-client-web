import React from 'react'
import { connect } from 'react-redux'
import { PermissionBase, mapStateToProps } from './Base'

export const permissionLevels = {
    u: "user",
    m: "manager",
    p: "player"
}

/**
 * Users manager
 */

export const IsUserManager = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user) {
            return (user.users_permission_level == 'm')
        }
    }
)

/**
 * Not self
 */

export const IsNotSelf = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user, object) {
            return (user.id != object.id)
        }
    }
)
