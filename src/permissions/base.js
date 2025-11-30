/**
 * Is authenticated
 */

export function isAuthenticated(user) {
  return !!user
}

/**
 * Is superuser
 */

export function isSuperUser(user) {
  if (!isAuthenticated(user)) {
    return false
  }

  return user.is_superuser
}
