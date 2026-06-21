import PropTypes from 'prop-types'
import { useState } from 'react'

import NotificationBar from 'components/generics/NotificationBar'
import { Status } from 'reducers/alterationsResponse'

export default function TokenWidget({ token }) {
  const [tokenCopyState, setTokenCopyState] = useState({
    status: null,
    date: null,
  })

  return (
    <div className="token-widget notifiable">
      <div className="token">{token}</div>
      <div className="controls">
        <button
          className="control square primary"
          onClick={() => {
            // copy text to clipboard using the clipboard API and manage
            // success or failure of the operation
            setTokenCopyState({ status: Status.pending, date: Date.now() })
            navigator.clipboard.writeText(token).then(
              () => {
                setTokenCopyState({
                  status: Status.successful,
                  date: Date.now(),
                })
              },
              () => {
                setTokenCopyState({ status: Status.failed, date: Date.now() })
              }
            )
          }}
        >
          <span className="icon">
            <i className="las la-clipboard"></i>
          </span>
        </button>
      </div>
      <NotificationBar
        alterationResponse={tokenCopyState}
        successfulMessage="Copied!"
        failedMessage="Error when copying to clipboard"
      />
    </div>
  )
}

TokenWidget.propTypes = {
  token: PropTypes.string.isRequired,
}
