import { isAuthenticated, isSuperUser } from 'permissions/base'

/**
 * Playlist manager
 */

export function isPlaylistManager(user) {
  if (!isAuthenticated(user)) {
    return false
  }

  if (isSuperUser(user)) {
    return true
  }

  return user.playlist_permission_level === 'm'
}

export const useIsPlaylistManager = () => (user) => isPlaylistManager(user)

/**
 * Playlist manager or Owner of the object
 */

export function isPlaylistManagerOrOwner(user, object) {
  if (!isAuthenticated(user)) {
    return false
  }

  if (isPlaylistManager(user)) {
    return true
  }

  if (!object) {
    return false
  }

  return user.id === object.owner.id
}

export const useIsPlaylistManagerOrOwner = () => (user, object) =>
  isPlaylistManagerOrOwner(user, object)

/**
 * Playlist user
 */

export function isPlaylistUser(user) {
  if (!isAuthenticated(user)) {
    return false
  }

  if (isPlaylistManager(user)) {
    return true
  }

  return user.playlist_permission_level === 'u'
}

export const useIsPlaylistUser = () => (user) => isPlaylistUser(user)

/**
 * Can add to playlist
 */

export function canAddToPlaylist(user, karaoke) {
  if (!karaoke.ongoing) {
    return false
  }

  if (!isAuthenticated(user)) {
    return false
  }

  if (isPlaylistManager(user)) {
    return true
  }

  if (!karaoke.can_add_to_playlist) {
    return false
  }

  return isPlaylistUser(user)
}

export const useCanAddToPlaylist = () => (user, karaoke) =>
  canAddToPlaylist(user, karaoke)
