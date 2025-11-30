import { determineToFalse, isDeterminated } from 'permissions'
import { isSuperUser } from 'permissions/base'

/**
 * Users manager
 */

export function isUserManager(user) {
  const superUser = isSuperUser(user)

  if (isDeterminated(superUser)) {
    return superUser
  }

  if (user.users_permission_level === 'm') {
    return true
  }

  return undefined
}

export const useIsUserManager = () => (user) =>
  determineToFalse(isUserManager(user))

/**
 * Not self
 */

export function isNotSelf(user, other) {
  const superUser = isSuperUser(user)

  if (isDeterminated(superUser)) {
    return superUser
  }

  if (user.id !== other.id) {
    return true
  }

  return undefined
}

export const useIsNotSelf = () => (user, other) =>
  determineToFalse(isNotSelf(user, other))
