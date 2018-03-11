import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { PermissionBase, mapStateToProps } from './Base'
import { userPropType } from 'serverPropTypes/users'

/**
 * Playlist manager or Owner of the object
 */

export const IsPlaylistManagerOrOwner = withRouter(connect(
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
            if (user.playlist_permission_level == 'm') {
                return true
            }

            if (!object) {
                return false
            }

            return user.id == object.owner.id
        }
    }
))


/**
 * Playlist user or Playlist manager
 */

export const IsPlaylistUser = withRouter(connect(
    mapStateToProps
)(
    class extends PermissionBase {
        static hasPermissionCustom(user) {
            return (user.playlist_permission_level == 'u' ||
                user.playlist_permission_level == 'm')
        }
    }
))


/**
 * Kara status is not stopped
 */

class KaraStatusIsNotStopped extends Component {
    render() {
        if (this.props.karaStatus.status == 'stop') {
            return null
        }

        return this.props.children
    }
}

const mapStateToPropsKaraStatus = (state) => ({
    karaStatus: state.player.digest.data.kara_status,
})

KaraStatusIsNotStopped = connect(
        mapStateToPropsKaraStatus,
        {}
)(KaraStatusIsNotStopped)

export {KaraStatusIsNotStopped}
