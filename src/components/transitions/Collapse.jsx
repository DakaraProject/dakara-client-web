import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transitioning'

export default function Collapse({
  in: inProp,
  duration = 300,
  horizontal = false,
  force = false,
  children,
  ...rest
}) {
  return (
    <CSSTransition
      in={inProp}
      classNames={`collapse-${force ? 'force-' : ''}${horizontal ? 'horizontal' : 'vertical'}`}
      duration={duration}
      {...rest}
    >
      {children}
    </CSSTransition>
  )
}

Collapse.propTypes = {
  in: PropTypes.bool,
  duration: PropTypes.number,
  horizontal: PropTypes.bool,
  force: PropTypes.bool,
  children: PropTypes.node,
}
