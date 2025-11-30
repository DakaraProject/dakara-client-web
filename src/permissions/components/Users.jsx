import PropTypes from 'prop-types'

import { PermissionBase } from 'permissions/components/Base'
import { useIsNotSelf, useIsUserManager } from 'permissions/users'
import { userPropType } from 'serverPropTypes/users'

/**
 * Users manager
 */

export function IsUserManager({ user, children, ...rest }) {
  const isUserManeger = useIsUserManager()
  return (
    <PermissionBase hasPermission={isUserManeger(user)} {...rest}>
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
  const isNotSelf = useIsNotSelf()
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
