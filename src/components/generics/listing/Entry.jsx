import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { CSSTransition } from 'react-transition-group'

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
  noTransition,
  ...rest
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const expandable = !!entryExpanded
  // expanded state is stored in the search parameters, not in the state of the
  // component
  const expanded = !!(expandable && searchParams.get('expanded') == id)

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
  const content = (
    <li className="listing-entry listable">
      <div
        className={classNames('one-line', {
          hoverizable: !noHoverizable,
          notifiable: isDisplayable(notifications),
        })}
      >
        {expandable ? (
          <Expander setExpanded={setExpanded}>
            <div className="main">{children}</div>
          </Expander>
        ) : (
          <div className="main">{children}</div>
        )}
        {!expanded && isDisplayable(extra) && (
          <ul className="extra">{extra}</ul>
        )}
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

  if (noTransition) {
    return content
  }
  return (
    <CSSTransition
      classNames="add-remove"
      timeout={{
        enter: 300,
        exit: 600,
      }}
      {...rest}
    >
      {content}
    </CSSTransition>
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
  noTransition: PropTypes.bool,
}

function Expander({ children, setExpanded }) {
  return (
    <button className="expander transparent" onClick={setExpanded}>
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
