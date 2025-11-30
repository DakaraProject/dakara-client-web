import PropTypes from 'prop-types'

import { PermissionBase } from 'permissions/components/Base'
import { isNotSelf, isUserManager } from 'permissions/users'
import { userPropType } from 'serverPropTypes/users'

/**
 * Users manager
 */

export function IsUserManager({ user, children, ...rest }) {
  return (
    <PermissionBase hasPermission={isUserManager(user)} {...rest}>
      {children}
    </PermissionBase>
  )
}

IsUserManager.propTypes = {
  user: userPropType,
  children: PropTypes.node,
}

/**
 * Not self
 */

export function IsNotSelf({ user, other, children, ...rest }) {
  return (
    <PermissionBase hasPermission={isNotSelf(user, other)} {...rest}>
      {children}
    </PermissionBase>
  )
}

IsNotSelf.propTypes = {
  user: userPropType,
  other: userPropType,
  children: PropTypes.node,
}
