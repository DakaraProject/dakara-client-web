import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'

import Slide from 'components/transitions/Slide'
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
  const [lastState, setLastState] = useState({ status: null, date: null })
  const [show, setShow] = useState(false)
  const [hideTimeout, setHideTimeout] = useState(null)

  const durations = {
    [Status.successful]: successfulDuration,
    [Status.failed]: failedDuration,
  }

  const { status, date } = alterationResponse
  if (
    status &&
    date &&
    (status !== lastState.status || date !== lastState.date)
  ) {
    setLastState({ status, date })
    setShow(true)

    // schedule to hide the notification only when a non-pending status has
    // been reached
    const duration = durations[status]
    if (status !== Status.pending && duration) {
      setHideTimeout(
        setTimeout(() => {
          setShow(false)
        }, duration)
      )
    }
  }

  // clear the schedule to hide the notification if it changes
  useEffect(
    () => () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    },
    [hideTimeout]
  )

  // get the correct message to display in the notification, depending on the
  // alteration response and the component's values
  const getMessage = useCallback(
    (alterationResponse) => {
      const { status, fields, message } = alterationResponse

      // leave early if blank alteration response
      if (!status) {
        return
      }

      // specific case if the alteration response contains field errors
      if (fields && Object.keys(fields).length) {
        return 'There are field errors'
      }

      // specific case if the alteration contains a message
      if (message) {
        return message
      }

      const messages = {
        [Status.pending]: pendingMessage,
        [Status.successful]: successfulMessage,
        [Status.failed]: failedMessage,
      }

      // default to specified messages
      return messages[status]
    },
    [pendingMessage, successfulMessage, failedMessage]
  )

  const notificationMessage = getMessage(alterationResponse)

  return (
    <Slide in={show}>
      {notificationMessage && (
        <div className="notification-bar notified transition">
          <div
            className={`notification non-hoverizable ${types[status] || ''}`}
          >
            <div className="message">{notificationMessage}</div>
          </div>
        </div>
      )}
    </Slide>
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
