import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import {
  alterationResponsePropType,
  Status,
} from 'reducers/alterationsResponse'

const notificationTypes = {
  [Status.pending]: 'success',
  [Status.successful]: 'success',
  [Status.failed]: 'danger',
}

export default function Notification({
  alterationResponse,
  failedDuration = 5000,
  failedMessage = 'Failure',
  pendingMessage = 'Pending…',
  successfulDuration = 3000,
  successfulMessage = 'Success',
  noDisplayOnMount = false,
}) {
  const [display, setDisplay] = useState(!noDisplayOnMount)

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

  const {
    status,
    date,
    message: messageInState,
    fields: fieldsInState,
  } = alterationResponse || {}
  useEffect(() => {
    if (!status || !date) {
      return
    }

    // display if status and date changed and have a valid value
    setDisplay(true)

    // request to hide success or failure message only after a certain time
    let timeout
    if (status !== Status.pending && durations[status]) {
      timeout = setTimeout(() => {
        setDisplay(false)
      }, durations[status])
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, date])

  let notification
  if (display && alterationResponse) {
    // if there is a message in the state, keep it
    // if there is a field in the state, consider there was an error with fields
    // otherwise, use the messages passed to the compenent
    let message
    if (messageInState) {
      message = messageInState
    } else if (fieldsInState && Object.keys(fieldsInState).length > 0) {
      message = 'There are field errors.'
    } else {
      message = messages[status]
    }

    // if there is no message to display, do not show any notification
    if (message) {
      notification = (
        <CSSTransition
          classNames="notified"
          timeout={{
            enter: 300,
            exit: 150,
          }}
        >
          <div className="notified">
            <div
              className={classNames(
                'notification non-hoverizable',
                notificationTypes[status]
              )}
            >
              <div className="message">{message}</div>
            </div>
          </div>
        </CSSTransition>
      )
    }
  }

  return (
    <TransitionGroup className="notification-wrapper">
      {notification}
    </TransitionGroup>
  )
}

Notification.propTypes = {
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
