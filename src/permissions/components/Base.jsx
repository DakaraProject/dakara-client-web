import PropTypes from 'prop-types'
import React from 'react'

import { isAuthenticated } from 'permissions/base'
import { userPropType } from 'serverPropTypes/users'

/**
 * Base permission.
 */

export function PermissionBase({ disable, children, hasPermission }) {
  // if the user has permission to display the children
  if (hasPermission) {
    return children
  }

  // if the children can be disabled, display them disabled
  if (disable) {
    const childrenToProcess =
      React.Children.count(children) > 1 ? children : [children]

    return React.Children.map(childrenToProcess, (child) =>
      React.cloneElement(child, { disabled: true })
    )
  }

  // else, do not display them at all
  return null
}

PermissionBase.propTypes = {
  disable: PropTypes.bool,
  children: PropTypes.node,
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
