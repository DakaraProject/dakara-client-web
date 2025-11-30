import PropTypes from 'prop-types'

import Delayer from 'components/generics/Delayer'
import Notification from 'components/generics/Notification'
import { Status } from 'reducers/alterationsResponse'

export default function FetchWrapper({ status, children }) {
  let pending
  if (status === Status.pending) {
    pending = (
      <Delayer delay={200}>
        <div className="overlay">
          <div className="pending">Fetching...</div>
        </div>
      </Delayer>
    )
  }

  return (
    <div className="listing-fetch-wrapper notifiable">
      {children}
      <Notification
        alterationStatus={{ status }}
        pendingMessage={false}
        successfulMessage={false}
        failedMessage="Unable to get results"
        failedDuration={null}
      />
      {pending}
    </div>
  )
}

FetchWrapper.propTypes = {
  status: PropTypes.symbol,
  children: PropTypes.node,
}
