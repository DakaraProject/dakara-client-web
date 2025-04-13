import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useState } from 'react'

export function Details({ children }) {
  return <div className="details">{children}</div>
}

Details.propTypes = {
  children: PropTypes.element,
}

export function DetailText({ children, header }) {
  return (
    <div className="detail">
      <h4 className="header">{header}</h4>
      <div className="content text">{children}</div>
    </div>
  )
}

DetailText.propTypes = {
  children: PropTypes.element,
  header: PropTypes.element,
}

export function DetailLongText({ children, header }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="detail">
      <h4 className="header">{header}</h4>
      <div className="content long-text">
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
      </div>
    </div>
  )
}

DetailLongText.propTypes = {
  children: PropTypes.element,
  header: PropTypes.element,
}

export function DetailAny({ children, header }) {
  return (
    <div className="detail">
      <h4 className="header">{header}</h4>
      <div className="content">{children}</div>
    </div>
  )
}

DetailAny.propTypes = {
  children: PropTypes.element,
  header: PropTypes.element,
}
