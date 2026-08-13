import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useMatch } from 'react-router'

import { getParentURL } from 'utils'

export function TabBar({ children }) {
  return <nav className="tab-bar controls compact">{children}</nav>
}

TabBar.propTypes = {
  children: PropTypes.node,
}

export function Tab({
  extraClassName,
  iconName,
  name,
  isDefault,
  to,
  ...rest
}) {
  let tabName
  if (name) {
    tabName = <span className="name">{name}</span>
  }

  // active if the parent is active
  const toParent = isDefault ? getParentURL(to) : ''
  const isActive = useMatch(toParent) && isDefault

  // classes
  const linkClass = classNames('tab control neutral listable', extraClassName, {
    square: !name,
    active: isActive,
  })

  return (
    <NavLink className={linkClass} to={to} {...rest}>
      <span className="icon">
        <i className={`las la-${iconName}`}></i>
      </span>
      {tabName}
    </NavLink>
  )
}

Tab.propTypes = {
  extraClassName: PropTypes.string,
  iconName: PropTypes.string,
  name: PropTypes.string,
  to: PropTypes.string,
  isDefault: PropTypes.bool,
}
