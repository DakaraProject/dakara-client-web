import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transitioning'

export default function Collapse({ in: inProp, duration = 300, children }) {
  return (
    <CSSTransition in={inProp} classNames="collapse" duration={duration}>
      {children}
    </CSSTransition>
  )
}

Collapse.propTypes = {
  in: PropTypes.bool,
  duration: PropTypes.number,
  children: PropTypes.node,
}
