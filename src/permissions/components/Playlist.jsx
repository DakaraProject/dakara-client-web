import PropTypes from 'prop-types'

import { PermissionBase } from 'permissions/components/Base'
import {
  canAddToPlaylist,
  isPlaylistManager,
  isPlaylistManagerOrOwner,
  isPlaylistUser,
} from 'permissions/playlist'
import { karaokePropType } from 'serverPropTypes/playlist'
import { userPropType } from 'serverPropTypes/users'

/**
 * Playlist manager
 */

export function IsPlaylistManager({ user, children, ...rest }) {
  return (
    <PermissionBase hasPermission={isPlaylistManager(user)} {...rest}>
      {children}
    </PermissionBase>
  )
}

IsPlaylistManager.propTypes = {
  user: userPropType,
  children: PropTypes.node,
}

/**
 * Playlist manager or Owner of the object
 */

export function IsPlaylistManagerOrOwner({ user, object, children, ...rest }) {
  return (
    <PermissionBase
      hasPermission={isPlaylistManagerOrOwner(user, object)}
      {...rest}
    >
      {children}
    </PermissionBase>
  )
}

IsPlaylistManagerOrOwner.propTypes = {
  user: userPropType,
  object: PropTypes.shape({
    owner: userPropType,
  }),
  children: PropTypes.node,
}

/**
 * Playlist user
 */

export function IsPlaylistUser({ user, children, ...rest }) {
  return (
    <PermissionBase hasPermission={isPlaylistUser(user)} {...rest}>
      {children}
    </PermissionBase>
  )
}

IsPlaylistUser.propTypes = {
  user: userPropType,
  children: PropTypes.node,
}

/**
 * Can add to playlist
 */

export function CanAddToPlaylist({ user, karaoke, children, ...rest }) {
  return (
    <PermissionBase hasPermission={canAddToPlaylist(user, karaoke)} {...rest}>
      {children}
    </PermissionBase>
  )
}

CanAddToPlaylist.propTypes = {
  user: userPropType,
  karaoke: karaokePropType.isRequired,
  children: PropTypes.node,
}
