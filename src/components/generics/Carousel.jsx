import classNames from 'classnames'
import PropTypes from 'prop-types'

import { isDisplayable } from 'utils'

export function Carousel({ children, className }) {
  return (
    <div className={classNames('carousel', className)}>
      <ul className="viewport">{children}</ul>
    </div>
  )
}

Carousel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export function CarouselEntry({ children, className, jumbo }) {
  return (
    <li className="carousel-entry">
      {isDisplayable(jumbo) && <div className="jumbo">{jumbo}</div>}
      <div className="content" tabIndex="0">
        <div className={className}>{children}</div>
      </div>
    </li>
  )
}

CarouselEntry.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  jumbo: PropTypes.string,
}
