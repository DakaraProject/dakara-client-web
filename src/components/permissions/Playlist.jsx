import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { PermissionBase } from 'components/permissions/Base'
import { userPropType } from 'serverPropTypes/users'
import { mapStateToProps } from 'utils/permissions'

/**
 * Playlist manager or Owner of the object
 */

export const IsPlaylistManagerOrOwner = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static propTypes = {
            ...PermissionBase.propTypes,
            object: PropTypes.shape({
                owner: userPropType.isRequired,
            }),
        }

        static hasPermissionCustom(user, object) {
            if (user.playlist_permission_level === 'm') {
                return true
            }

            if (!object) {
                return false
            }

            return user.id === object.owner.id
        }
    }
)

/**
 * Playlist manager
 */

export const IsPlaylistManager = connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static propTypes = {
            ...PermissionBase.propTypes,
        }

        static hasPermissionCustom(user) {
            return user.playlist_permission_level === 'm'
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
            return (user.playlist_permission_level === 'u' ||
                user.playlist_permission_level === 'm')
        }
    }
)


/**
 * Kara status is stopped
 */

class CanAddToPlaylist extends Component {
    render() {
        const { user } = this.props
        const { data: karaoke } = this.props.karaokeState
        if (!karaoke.ongoing) {
            return null
        }

        if (user.is_superuser || user.playlist_permission_level === 'm') {
            return this.props.children
        }

        if (!karaoke.can_add_to_playlist) {
            return null
        }

        return this.props.children
    }
}

const mapStateToPropsKaraoke = (state) => ({
    karaokeState: state.playlist.karaoke,
    user: state.authenticatedUser
})

CanAddToPlaylist= connect(
        mapStateToPropsKaraoke,
        {}
)(CanAddToPlaylist)

export {CanAddToPlaylist}
