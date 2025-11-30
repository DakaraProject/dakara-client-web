import { determineToFalse, isDeterminated } from 'permissions'
import { isSuperUser } from 'permissions/base'

/**
 * Playlist manager
 */

export function isPlaylistManager(user) {
  const superUser = isSuperUser(user)

  if (isDeterminated(superUser)) {
    return superUser
  }

  if (user.playlist_permission_level === 'm') {
    return true
  }

  return undefined
}

export const useIsPlaylistManager = () => (user) =>
  determineToFalse(isPlaylistManager(user))

/**
 * Playlist manager or Owner of the object
 */

export function isPlaylistManagerOrOwner(user, object) {
  const playlistManager = isPlaylistManager(user)

  if (isDeterminated(playlistManager)) {
    return playlistManager
  }

  if (!object) {
    return false
  }

  if (user.id === object.owner.id) {
    return true
  }

  return undefined
}

export const useIsPlaylistManagerOrOwner = () => (user, object) =>
  isPlaylistManagerOrOwner(user, object)

/**
 * Playlist user
 */

export function isPlaylistUser(user) {
  const playlistManager = isPlaylistManager(user)

  if (isDeterminated(playlistManager)) {
    return playlistManager
  }

  if (user.playlist_permission_level === 'u') {
    return true
  }

  return undefined
}

export const useIsPlaylistUser = () => (user) =>
  determineToFalse(isPlaylistUser(user))

/**
 * Can add to playlist
 */

export function canAddToPlaylist(user, karaoke) {
  if (!karaoke.ongoing) {
    return false
  }

  const playlistManager = isPlaylistManager(user)
  if (isDeterminated(playlistManager)) {
    return playlistManager
  }

  if (!karaoke.can_add_to_playlist) {
    return false
  }

  const playlistUser = isPlaylistUser(user)
  if (isDeterminated(playlistUser)) {
    return isPlaylistUser
  }

  return undefined
}

export const useCanAddToPlaylist = () => (user, karaoke) =>
  determineToFalse(canAddToPlaylist(user, karaoke))
