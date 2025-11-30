import PropTypes from 'prop-types'

import { PermissionBase } from 'permissions/components/Base'
import { useIsLibraryManager } from 'permissions/library'
import { userPropType } from 'serverPropTypes/users'

/**
 * Library manager
 */

export function IsLibraryManager({ user, children, ...rest }) {
  const isLibraryManager = useIsLibraryManager()
  return (
    <PermissionBase hasPermission={isLibraryManager(user)} {...rest}>
      {children}
    </PermissionBase>
  )
}

IsLibraryManager.propTypes = {
  user: userPropType,
  children: PropTypes.node,
}
