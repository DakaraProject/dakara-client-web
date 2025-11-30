import { isAuthenticated, isSuperUser } from 'permissions/base'

/**
 * Library manager
 */

export function isLibraryManager(user) {
  if (!isAuthenticated(user)) {
    return false
  }

  if (isSuperUser(user)) {
    return true
  }

  return user.library_permission_level === 'm'
}

export const useIsLibraryManager = () => (user) => isLibraryManager(user)
