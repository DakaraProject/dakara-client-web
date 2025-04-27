import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'

export function Details({ children }) {
  return <div className="details">{children}</div>
}

Details.propTypes = {
  children: PropTypes.element,
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
  children: PropTypes.element,
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
  children: PropTypes.element,
  icon: PropTypes.string,
  name: PropTypes.string,
}

export function DetailLongText({ children, icon, name }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <DetailAny icon={icon} name={name} className="long-text">
      <p className={classNames('paragraph', { expanded })}>{children}</p>
      <div className="controls">
        <button
          className="control neutral square"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="icon">
            <i
              className={classNames(
                'las',
                expanded ? 'la-minus-square' : 'la-plus-square'
              )}
            ></i>
          </span>
        </button>
      </div>
    </DetailAny>
  )
}

DetailLongText.propTypes = {
  children: PropTypes.element,
  icon: PropTypes.string,
  name: PropTypes.string,
}
