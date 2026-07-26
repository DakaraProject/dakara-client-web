import PropTypes from 'prop-types'

import { isAuthenticated } from 'permissions/base'
import { userPropType } from 'serverPropTypes/users'

/**
 * Base permission.
 */

export function PermissionBase({
  children,
  disablableChildren,
  hasPermission,
}) {
  // if the user has permission to display the children
  if (hasPermission) {
    if (disablableChildren) {
      return disablableChildren(false)
    }

    return children
  }

  // if the children can be disabled, display them disabled
  if (disablableChildren) {
    return disablableChildren(true)
  }

  // otherwise, do not display them at all
  return null
}

PermissionBase.propTypes = {
  disable: PropTypes.bool,
  children: PropTypes.node,
  disablableChildren: PropTypes.func,
  hasPermission: PropTypes.bool,
}

/**
 * Is authenticated.
 */

export function IsAuthenticated({ user, ...rest }) {
  return <PermissionBase hasPermission={isAuthenticated(user)} {...rest} />
}

IsAuthenticated.propTypes = {
  user: userPropType,
}
