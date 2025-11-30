import { PermissionBase } from 'permissions/components/Base'
import { isLibraryManager } from 'permissions/library'
import { userPropType } from 'serverPropTypes/users'

/**
 * Library manager
 */

export function IsLibraryManager({ user, ...rest }) {
  return <PermissionBase hasPermission={isLibraryManager(user)} {...rest} />
}

IsLibraryManager.propTypes = {
  user: userPropType,
}
