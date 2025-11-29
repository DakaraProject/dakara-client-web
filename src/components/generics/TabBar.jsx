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
  defaultRoute,
  to,
  ...rest
}) {
  let tabName
  if (name) {
    tabName = <span className="name">{name}</span>
  }

  // active if the parent is active
  const toParent = defaultRoute ? getParentURL(to) : ''
  const active = useMatch(toParent) && defaultRoute

  // classes
  const linkClass = classNames('tab control neutral listable', extraClassName, {
    square: !name,
    active,
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
  defaultRoute: PropTypes.bool,
}
