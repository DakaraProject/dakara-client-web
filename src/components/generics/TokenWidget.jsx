import PropTypes from 'prop-types'
import { useState } from 'react'

import Notification from 'components/generics/Notification'
import { Status } from 'reducers/alterationsResponse'

export default function TokenWidget({ token }) {
  const [tokenCopyStatus, setTokenCopyStatus] = useState()

  return (
    <div className="token-widget notifiable">
      <div className="token">{token}</div>
      <div className="controls">
        <button
          className="control square primary"
          onClick={() => {
            // copy text to clipboard using the clipboard API and manage
            // success or failure of the operation
            setTokenCopyStatus(Status.pending)
            navigator.clipboard.writeText(token).then(
              () => {
                setTokenCopyStatus(Status.successful)
              },
              () => {
                setTokenCopyStatus(Status.failed)
              }
            )
          }}
        >
          <span className="icon">
            <i className="las la-clipboard"></i>
          </span>
        </button>
      </div>
      <Notification
        alterationResponse={{
          status: tokenCopyStatus,
          date: -1, // XXX There should be a valid date here
        }}
        successfulMessage="Copied!"
        failedMessage="Error when copying to clipboard"
      />
    </div>
  )
}

TokenWidget.propTypes = {
  token: PropTypes.string.isRequired,
}
