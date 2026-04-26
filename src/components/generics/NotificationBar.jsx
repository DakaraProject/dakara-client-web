import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition } from 'react-transitioning'

import {
  alterationResponsePropType,
  Status,
} from 'reducers/alterationsResponse'

const types = {
  [Status.pending]: 'success',
  [Status.successful]: 'success',
  [Status.failed]: 'danger',
}

export default function NotificationBar({
  alterationResponse = {},
  failedDuration = 5000,
  failedMessage = 'Failure',
  pendingMessage = 'Pending…',
  successfulDuration = 3000,
  successfulMessage = 'Success',
  noDisplayOnMount = false,
}) {
  const [show, setShow] = useState(false)

  const durations = useMemo(
    () => ({
      [Status.successful]: successfulDuration,
      [Status.failed]: failedDuration,
    }),
    [successfulDuration, failedDuration]
  )
  const messages = useMemo(
    () => ({
      [Status.pending]: pendingMessage,
      [Status.successful]: successfulMessage,
      [Status.failed]: failedMessage,
    }),
    [pendingMessage, successfulMessage, failedMessage]
  )

  const { status, date } = alterationResponse

  const getMessage = useCallback(
    (alterationResponse) => {
      const { status, fields, message } = alterationResponse

      // specific case if the alteration response contains field errors
      if (fields && Object.keys(fields).length) {
        return 'There are field errors'
      }

      // specific case if the alteration contains a message
      if (message) {
        return message
      }

      // default to specified messages
      return messages[status]
    },
    [messages]
  )

  useEffect(() => {
    if (!status || !date) {
      return
    }

    // display if status and date changed and have a valid value
    setShow(true)

    // request to hide success or failure message only after a certain time
    let timeout
    if (status !== Status.pending && durations[status]) {
      timeout = setTimeout(() => {
        setShow(false)
      }, durations[status])
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, date])

  const notificationMessage = getMessage(alterationResponse)

  if (!notificationMessage) {
    return null
  }

  return (
    <CSSTransition in={show} classNames="slide" duration="300">
      <div className="notification-bar notified">
        <div className={`notification non-hoverizable ${types[status] || ''}`}>
          <div className="message">{notificationMessage}</div>
        </div>
      </div>
    </CSSTransition>
  )
}

NotificationBar.propTypes = {
  alterationResponse: alterationResponsePropType,
  failedDuration: PropTypes.number,
  failedMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  pendingMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  successfulDuration: PropTypes.number,
  successfulMessage: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  noDisplayOnMount: PropTypes.bool,
}

/**
 * Helper to create a notifiable area in a table
 *
 * Must be used on the cell of the first column.
 */
export function NotifiableForTable({ className, children }) {
  const elementRef = useRef()

  const [parentTableElement, setParentTableElement] = useState(null)

  useEffect(() => {
    // find parent table DOM node
    const element = elementRef.current
    setParentTableElement(element.closest('table'))
  }, [])

  // get the width of the element with the width of the closest table
  const width = parentTableElement?.clientWidth

  return (
    <div className="notifiable-for-table" ref={elementRef}>
      <div className={classNames('notifiable', className)} style={{ width }}>
        {children}
      </div>
    </div>
  )
}

NotifiableForTable.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}
