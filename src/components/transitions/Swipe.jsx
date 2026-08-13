import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transitioning'

export default function Swipe({
  in: inProp,
  duration = 300,
  children,
  ...rest
}) {
  return (
    <CSSTransition in={inProp} classNames="swipe" duration={duration} {...rest}>
      {children}
    </CSSTransition>
  )
}

Swipe.propTypes = {
  in: PropTypes.bool,
  duration: PropTypes.number,
  children: PropTypes.node,
}
