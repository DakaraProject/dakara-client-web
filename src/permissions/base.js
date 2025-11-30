import { determineToFalse, determineToTrue, isDeterminated } from 'permissions'

/**
 * Is authenticated
 */

export function isAuthenticated(user) {
  // if the user is not connected, access denied
  if (!user) {
    return false
  }

  return undefined
}

export const useIsAuthenticated = () => (user) =>
  determineToTrue(isAuthenticated(user))

/**
 * Is superuser
 */

export function isSuperUser(user) {
  const authenticated = isAuthenticated(user)

  if (isDeterminated(authenticated)) {
    return authenticated
  }

  // if the user is the superuser, all access granted
  if (user.is_superuser) {
    return true
  }

  return undefined
}

export const useIsSuperUser = () => (user) =>
  determineToFalse(isSuperUser(user))
