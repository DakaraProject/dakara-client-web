import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link, useSearchParams } from 'react-router'

const namesType = PropTypes.shape({
  plural: PropTypes.string.isRequired,
  singular: PropTypes.string.isRequired,
})
const paginationType = PropTypes.shape({
  current: PropTypes.number.isRequired,
  last: PropTypes.number.isRequired,
})

function PaginatorLink({ page, icon, disabled }) {
  const [searchParams, _] = useSearchParams()
  searchParams.set('page', page)

  return (
    <Link
      to={{ search: searchParams.toString() }}
      className={classNames('control', 'square', 'primary', {
        disabled,
      })}
    >
      <span className="icon">
        <i className={icon}></i>
      </span>
    </Link>
  )
}

PaginatorLink.propTypes = {
  page: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

function Paginator({ pagination }) {
  const { current, last } = pagination

  const hasNext = current < last
  const hasPrevious = current > 1

  return (
    <nav className="paginator controls">
      <PaginatorLink
        page={1}
        icon="las la-angle-double-left"
        disabled={!hasPrevious}
      />
      <PaginatorLink
        page={current - 1}
        icon="las la-angle-left"
        disabled={!hasPrevious}
      />
      <PaginatorLink
        page={current + 1}
        icon="las la-angle-right"
        disabled={!hasNext}
      />
      <PaginatorLink
        page={last}
        icon="las la-angle-double-right"
        disabled={!hasNext}
      />
    </nav>
  )
}

Paginator.propTypes = {
  pagination: paginationType.isRequired,
}

function Counter({ names, count }) {
  return (
    <div className="counter">
      <span className="figure">{count}</span>
      <span className="text">
        {count === 1 ? names.singular : names.plural}
      </span>
    </div>
  )
}

Counter.propTypes = {
  names: namesType.isRequired,
  count: PropTypes.number.isRequired,
}

export default function Navigator({ count, names, pagination }) {
  return (
    <div className="navigator">
      {pagination && <Paginator pagination={pagination} />}
      {names && count >= 0 && <Counter names={names} count={count} />}
    </div>
  )
}

Navigator.propTypes = {
  count: PropTypes.number,
  names: namesType,
  pagination: paginationType,
}
