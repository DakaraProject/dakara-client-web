import { isAuthenticated, isSuperUser } from 'permissions/base'

/**
 * Users manager
 */

export function isUserManager(user) {
  if (!isAuthenticated(user)) {
    return false
  }

  if (isSuperUser(user)) {
    return true
  }

  return user.users_permission_level === 'm'
}

export const useIsUserManager = () => (user) => isUserManager(user)

/**
 * Not self
 */

export function isNotSelf(user, other) {
  if (!isAuthenticated(user)) {
    return false
  }

  if (isSuperUser(user)) {
    return true
  }

  if (!other) {
    return false
  }

  return user.id !== other.id
}

export const useIsNotSelf = () => (user, other) => isNotSelf(user, other)
