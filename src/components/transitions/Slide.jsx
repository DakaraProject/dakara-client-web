import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transitioning'

export default function Slide({ in: inProp, duration = 300, children }) {
  return (
    <CSSTransition in={inProp} classNames="slide" duration={duration}>
      {children}
    </CSSTransition>
  )
}

Slide.propTypes = {
  in: PropTypes.bool,
  duration: PropTypes.number,
  children: PropTypes.node,
}
