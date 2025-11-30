import { determineToFalse, isDeterminated } from 'permissions'
import { isSuperUser } from 'permissions/base'

/**
 * Library manager
 */

export function isLibraryManager(user) {
  const superUser = isSuperUser(user)

  if (isDeterminated(superUser)) {
    return superUser
  }

  if (user.library_permission_level === 'm') {
    return true
  }

  return undefined
}

export const useIsLibraryManager = () => (user) =>
  determineToFalse(isLibraryManager(user))
