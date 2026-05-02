import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transitioning'

export default function Collapse({
  in: inProp,
  classNames = 'collapse',
  duration = 300,
  horizontal = false,
  children,
  ...rest
}) {
  if (horizontal) {
    return (
      <CSSTransition
        in={inProp}
        classNames={`${classNames}-horizontal`}
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
      classNames={`${classNames}-vertical`}
      duration={duration}
      {...rest}
    >
      {children}
    </CSSTransition>
  )
}

Collapse.propTypes = {
  in: PropTypes.bool,
  classNames: PropTypes.string,
  duration: PropTypes.number,
  horizontal: PropTypes.bool,
  children: PropTypes.node,
}
