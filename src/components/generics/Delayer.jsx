import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export default function Delayer({ delay, children }) {
  const [display, setDisplay] = useState(false)

  // display content after a delay starting from when the component is mounted
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplay(true)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [delay])

  if (display) {
    return children
  }

  return null
}

Delayer.propTypes = {
  delay: PropTypes.number.isRequired,
  children: PropTypes.node,
}
