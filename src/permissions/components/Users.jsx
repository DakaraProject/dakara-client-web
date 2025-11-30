import { PermissionBase } from 'permissions/components/Base'
import { isNotSelf, isUsersManager } from 'permissions/users'
import { userPropType } from 'serverPropTypes/users'

/**
 * Users manager
 */

export function IsUsersManager({ user, ...rest }) {
  return <PermissionBase hasPermission={isUsersManager(user)} {...rest} />
}

IsUsersManager.propTypes = {
  user: userPropType,
}

/**
 * Not self
 */

export function IsNotSelf({ user, other, ...rest }) {
  return <PermissionBase hasPermission={isNotSelf(user, other)} {...rest} />
}

IsNotSelf.propTypes = {
  user: userPropType,
  other: userPropType,
}
