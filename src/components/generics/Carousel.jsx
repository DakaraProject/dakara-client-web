import classNames from 'classnames'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import PropTypes from 'prop-types'

import { isDisplayable } from 'utils'

export function Carousel({ children, className }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 20, skipSnaps: true },
    [
      Autoplay({
        delay: 6000,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        stopOnInteraction: false,
      }),
      WheelGesturesPlugin({
        forceWheelAxis: 'y',
      }),
    ]
  )

  return (
    <div className={classNames('carousel', className)}>
      <div className="structure" ref={emblaRef}>
        <ul className="viewport">{children}</ul>
      </div>
      <div className="controls compact">
        <button
          className="control square primary"
          onClick={() => emblaApi.scrollNext()}
        >
          <span className="icon">
            <i className="las la-angle-right"></i>
          </span>
        </button>
        <button
          className="control square primary"
          onClick={() => emblaApi.scrollPrev()}
        >
          <span className="icon">
            <i className="las la-angle-left"></i>
          </span>
        </button>
      </div>
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
