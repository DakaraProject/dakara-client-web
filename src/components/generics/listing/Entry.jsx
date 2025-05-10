import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'
import { isDisplayable } from 'utils'

export function ListingEntry({
  children,
  entryExpanded,
  extra,
  controls,
  notifications,
  id,
  onExpanded,
  noHoverizable,
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const expandable = !!entryExpanded
  // expanded state is stored in the search parameters, not in the state of the
  // component
  const expanded = expandable && searchParams.get('expanded') == id

  useEffect(() => {
    if (onExpanded) {
      onExpanded(expanded)
    }
  }, [expanded, onExpanded])

  const setExpanded = () => {
    // called when clicking the expand button, so it means the expanded
    // state is the reverse of `expanded`!
    searchParams.delete('expanded')
    if (!expanded) {
      searchParams.append('expanded', id)
    }
    setSearchParams(searchParams)
  }

  /**
   * Add transition to extra
   */

  let extraTransition
  if (extra) {
    extraTransition = [extra].flat().map((item, index) => (
      <CSSTransition
        key={index}
        classNames="add-remove"
        timeout={{
          enter: 300,
          exit: 150,
        }}
      >
        {item}
      </CSSTransition>
    ))
  }

  return (
    <li className={classNames('listing-entry listable', { expanded })}>
      <div
        className={classNames('one-line', {
          hoverizable: !noHoverizable,
          notifiable: isDisplayable(notifications),
        })}
      >
        <div className="sub-line">
          {expandable ? (
            <Expander setExpanded={setExpanded}>
              <div className="main">{children}</div>
            </Expander>
          ) : (
            <div className="main">{children}</div>
          )}
          {!expanded && (
            <TransitionGroup className="extra" component="ul">
              {extraTransition}
            </TransitionGroup>
          )}
        </div>
        {!expanded && isDisplayable(controls) && (
          <div className="controls compact">{controls}</div>
        )}
        {!expanded && isDisplayable(notifications) && (
          <div className="notifications">{notifications}</div>
        )}
      </div>
      <CSSTransitionLazy
        in={expanded}
        classNames="expand-collapse"
        timeout={{
          enter: 600,
          exit: 300,
        }}
      >
        <>{entryExpanded}</>
      </CSSTransitionLazy>
    </li>
  )
}

ListingEntry.propTypes = {
  children: PropTypes.node,
  entryExpanded: PropTypes.element,
  extra: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  controls: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  notifications: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  id: PropTypes.any,
  onExpanded: PropTypes.func,
  noHoverizable: PropTypes.bool,
}

function Expander({ children, setExpanded }) {
  return (
    <button
      className="expander transparent"
      onClick={() => {
        setExpanded()
      }}
    >
      <div className="controls">
        <div className="control neutral square">
          <span className="icon">
            <i className="las la-ellipsis-v"></i>
          </span>
        </div>
      </div>
      {children}
    </button>
  )
}

Expander.propTypes = {
  children: PropTypes.node,
  setExpanded: PropTypes.func,
}

export function ListingEntryExpanded({
  children,
  extra,
  controls,
  notifications,
}) {
  return (
    <div className="expanded">
      {isDisplayable(extra) && <ul className="extra">{extra}</ul>}
      <div className="main">{children}</div>
      {(isDisplayable(controls) || isDisplayable(notifications)) && (
        <div className="notifiable">
          {isDisplayable(controls) && (
            <div className="controls">{controls}</div>
          )}
          {isDisplayable(notifications) && (
            <div className="notifications">{notifications}</div>
          )}
        </div>
      )}
    </div>
  )
}

ListingEntryExpanded.propTypes = {
  children: PropTypes.node,
  extra: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  controls: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  notifications: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
}
