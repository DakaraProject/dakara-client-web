import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transitioning'

export default function Collapse({
  in: inProp,
  duration = 300,
  horizontal = false,
  children,
  ...rest
}) {
  if (horizontal) {
    return (
      <CSSTransition
        in={inProp}
        classNames="collapse-horizontal"
        duration={duration}
        {...rest}
      >
        {children}
      </CSSTransition>
    )
  }

  return (
    <CSSTransition
      in={inProp}
      classNames="collapse-vertical"
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
  children: PropTypes.node,
}
