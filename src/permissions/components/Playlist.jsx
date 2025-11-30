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

export function IsPlaylistManager({ user, ...rest }) {
  return <PermissionBase hasPermission={isPlaylistManager(user)} {...rest} />
}

IsPlaylistManager.propTypes = {
  user: userPropType,
}

/**
 * Playlist manager or Owner of the object
 */

export function IsPlaylistManagerOrOwner({ user, object, ...rest }) {
  return (
    <PermissionBase
      hasPermission={isPlaylistManagerOrOwner(user, object)}
      {...rest}
    />
  )
}

IsPlaylistManagerOrOwner.propTypes = {
  user: userPropType,
  object: PropTypes.shape({
    owner: userPropType,
  }),
}

/**
 * Playlist user
 */

export function IsPlaylistUser({ user, ...rest }) {
  return <PermissionBase hasPermission={isPlaylistUser(user)} {...rest} />
}

IsPlaylistUser.propTypes = {
  user: userPropType,
}

/**
 * Can add to playlist
 */

export function CanAddToPlaylist({ user, karaoke, ...rest }) {
  return (
    <PermissionBase hasPermission={canAddToPlaylist(user, karaoke)} {...rest} />
  )
}

CanAddToPlaylist.propTypes = {
  user: userPropType,
  karaoke: karaokePropType.isRequired,
}
