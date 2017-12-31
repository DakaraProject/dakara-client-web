import React from 'react'
import { connect } from 'react-redux'
import { PermissionBase, mapStateToProps } from './Base'

/**
 * Playlist manager or Owner of the object
 */

export const IsPlaylistManagerOrOwner = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user, object) {
            if (user.playlist_permission_level == 'm') {
                return true
            }

            if (!object) {
                return false
            }

            return user.id == object.owner.id
        }
    }
)


/**
 * Playlist user or Playlist manager
 */

export const IsPlaylistUser = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user) {
            return (user.playlist_permission_level == 'u' ||
                user.playlist_permission_level == 'm')
        }
    }
)
