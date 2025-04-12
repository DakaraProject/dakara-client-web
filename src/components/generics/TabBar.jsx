import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router'

export function TabBar({ children }) {
  return <nav className="tab-bar controls compact">{children}</nav>
}

TabBar.propTypes = {
  children: PropTypes.element,
}

export function Tab({ extraClassName, iconName, name, to }) {
  let tabName
  if (name) {
    tabName = <span className="name">{name}</span>
  }

  // classes
  const linkClass = classNames('tab control neutral listable', extraClassName, {
    square: !name,
  })

  return (
    <NavLink to={to} className={linkClass}>
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
  to: PropTypes.string.isRequired,
}
