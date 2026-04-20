import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { useDefaultTransitionState } from 'hooks/transitions'
import { isDisplayable } from 'utils'

export function ListingEntry({
  children,
  entryExpanded,
  extra,
  controls,
  notifications,
  id,
  onToggle,
  noHoverizable,
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const expandable = !!entryExpanded
  // expanded state is stored in the search parameters, not in the state of the
  // component
  const expanded = expandable && parseInt(searchParams.get('expanded')) === id

  // TODO store the component expanded state in the transition instead
  // this may resolve the transition flickering
  const [transitionState, transitionToggle] = useDefaultTransitionState({
    preExit: true,
  })

  useEffect(
    () => {
      // manage on toggle callback if any
      if (typeof onToggle === 'function') {
        onToggle(expanded)
      }

      // manage transition animation
      transitionToggle(expanded)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expanded]
  )

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
      {transitionState.isMounted && (
        <div className={`expansion ${transitionState.status}`}>
          {entryExpanded}
        </div>
      )}
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
  onToggle: PropTypes.func,
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
        <div className="control neutral square expand-button">
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
