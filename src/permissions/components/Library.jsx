import PropTypes from 'prop-types'

import { PermissionBase } from 'permissions/components/Base'
import { isLibraryManager } from 'permissions/library'
import { userPropType } from 'serverPropTypes/users'

/**
 * Library manager
 */

export function IsLibraryManager({ user, children, ...rest }) {
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
