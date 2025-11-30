/**
 * Is authenticated
 */

export function isAuthenticated(user) {
  return !!user
}

export const useIsAuthenticated = () => (user) => isAuthenticated(user)

/**
 * Is superuser
 */

export function isSuperUser(user) {
  if (!isAuthenticated(user)) {
    return false
  }

  return user.is_superuser
}

export const useIsSuperUser = () => (user) => isSuperUser(user)
