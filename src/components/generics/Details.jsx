import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'

import Collapse from 'components/transitions/Collapse'
import { isDisplayable } from 'utils'

export function Details({ children }) {
  return <div className="details">{children}</div>
}

Details.propTypes = {
  children: PropTypes.node,
}

export function DetailAny({ children, icon, name, className }) {
  return (
    <div className="detail">
      <h4 className="header">
        {icon && (
          <span className="icon">
            <i className={classNames('las', icon)}></i>
          </span>
        )}
        {name && <span className="name">{name}</span>}
      </h4>
      <div className="content">
        <div className={className}>{children}</div>
      </div>
    </div>
  )
}

DetailAny.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  icon: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
}

export function DetailText({ children, icon, name }) {
  return (
    <DetailAny icon={icon} name={name} className="text">
      {children}
    </DetailAny>
  )
}

DetailText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  icon: PropTypes.string,
  name: PropTypes.string,
}

export function DetailLongText({
  children,
  icon,
  name,
  onExpand,
  notifications,
}) {
  const [revealed, setRevealed] = useState(false)

  return (
    <DetailAny
      icon={icon}
      name={name}
      className={classNames('long-text', {
        notifiable: isDisplayable(notifications),
      })}
    >
      <Collapse in={revealed} exit={false} alwaysMounted={true}>
        <div className="border transition">
          <p className="paragraph">{children}</p>
        </div>
      </Collapse>
      {!revealed && (
        <div className="controls">
          <button
            className="control neutral square"
            onClick={() => {
              if (typeof onExpand === 'function') {
                onExpand()
              }
              setRevealed(true)
            }}
          >
            <span className="icon">
              <i className="las la-plus-square"></i>
            </span>
          </button>
        </div>
      )}
      {isDisplayable(notifications) && (
        <div className="notifications">{notifications}</div>
      )}
    </DetailAny>
  )
}

DetailLongText.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  icon: PropTypes.string,
  name: PropTypes.string,
  onExpand: PropTypes.func,
  notifications: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
}
