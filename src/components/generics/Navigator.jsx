import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { Link } from 'react-router'

import { withLocation } from 'thirdpartyExtensions/ReactRouterDom'

function LinkWithQuery({ to, children, ...rest }) {
  const newTo = { ...to, search: queryString.stringify(to.query) }
  return (
    <Link {...rest} to={newTo}>
      {children}
    </Link>
  )
}

LinkWithQuery.propTypes = {
  to: PropTypes.object,
  children: PropTypes.node,
}

class Navigator extends Component {
  static propTypes = {
    count: PropTypes.number,
    location: PropTypes.object.isRequired,
    names: PropTypes.shape({
      plural: PropTypes.string.isRequired,
      singular: PropTypes.string.isRequired,
    }),
    pagination: PropTypes.shape({
      current: PropTypes.number.isRequired,
      last: PropTypes.number.isRequired,
    }),
  }

  render() {
    const { location, names, count, pagination } = this.props

    /**
     * paginator
     */

    let paginator
    if (pagination) {
      const { current, last } = pagination

      const hasNext = current !== last
      const hasPrevious = current !== 1
      const pathname = location.pathname
      const query = queryString.parse(location.search)

      paginator = (
        <nav className="paginator controls">
          <LinkWithQuery
            to={{ pathname, query: { ...query, page: 1 } }}
            className={classNames('control', 'square', 'primary', {
              disabled: !hasPrevious,
            })}
          >
            <span className="icon">
              <i className="las la-angle-double-left"></i>
            </span>
          </LinkWithQuery>
          <LinkWithQuery
            to={{ pathname, query: { ...query, page: current - 1 } }}
            className={classNames('control', 'square', 'primary', {
              disabled: !hasPrevious,
            })}
          >
            <span className="icon">
              <i className="las la-angle-left"></i>
            </span>
          </LinkWithQuery>
          <LinkWithQuery
            to={{ pathname, query: { ...query, page: current + 1 } }}
            className={classNames('control', 'square', 'primary', {
              disabled: !hasNext,
            })}
          >
            <span className="icon">
              <i className="las la-angle-right"></i>
            </span>
          </LinkWithQuery>
          <LinkWithQuery
            to={{ pathname, query: { ...query, page: last } }}
            className={classNames('control', 'square', 'primary', {
              disabled: !hasNext,
            })}
          >
            <span className="icon">
              <i className="las la-angle-double-right"></i>
            </span>
          </LinkWithQuery>
        </nav>
      )
    }

    /**
     * items counter
     */

    let counter
    if (names && typeof count !== 'undefined') {
      counter = (
        <div className="counter">
          <span className="figure">{count}</span>
          <span className="text">
            {count === 1 ? names.singular : names.plural}
          </span>
        </div>
      )
    }

    return (
      <div className="navigator">
        {paginator}
        {counter}
      </div>
    )
  }
}

Navigator = withLocation(Navigator)

export default Navigator
