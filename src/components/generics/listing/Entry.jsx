import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router'

import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

/**
 * Returns `true` if the argument is not falsy, or not an empty list.
 */
function isDisplayable(item) {
  if (!item || item?.length === 0) {
    return false
  }

  return true
}

export function ListingEntry({
  children,
  entryExpanded,
  extra,
  controls,
  notifications,
  id,
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const expandable = !!entryExpanded
  // expanded state is stored in the search parameters, not in the state of the
  // component
  const expanded = !!(expandable && searchParams.get('expanded') == id)

  const setExpanded = () => {
    searchParams.delete('expanded')
    if (!expanded) {
      searchParams.append('expanded', id)
    }
    setSearchParams(searchParams)
  }

  return (
    <li className="listing-entry listable" key={id}>
      <div className="one-line hoverizable notifiable">
        {expandable ? (
          <Expander setExpanded={setExpanded}>
            <div className="main">{children}</div>
          </Expander>
        ) : (
          <div className="main">children</div>
        )}
        {!expanded && isDisplayable(extra) && (
          <div className="extra">{extra}</div>
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
        classNames="expand-view"
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
  children: PropTypes.element,
  entryExpanded: PropTypes.element,
  extra: PropTypes.arrayOf(PropTypes.element),
  controls: PropTypes.arrayOf(PropTypes.element),
  notifications: PropTypes.arrayOf(PropTypes.element),
  id: PropTypes.any,
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
  children: PropTypes.element,
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
      {isDisplayable(extra) && <div className="extra">{extra}</div>}
      <div className="main">{children}</div>
      <div className="notifiable">
        {isDisplayable(controls) && <div className="controls">{controls}</div>}
        {isDisplayable(notifications) && (
          <div className="notifications">{notifications}</div>
        )}
      </div>
    </div>
  )
}

ListingEntryExpanded.propTypes = {
  children: PropTypes.element,
  extra: PropTypes.arrayOf(PropTypes.element),
  controls: PropTypes.arrayOf(PropTypes.element),
  notifications: PropTypes.arrayOf(PropTypes.element),
}
