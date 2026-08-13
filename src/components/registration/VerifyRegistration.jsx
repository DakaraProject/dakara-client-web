import classNames from 'classnames'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { verifyRegistration } from 'actions/users'
import { Status } from 'reducers/alterationsResponse'

export default function VerifyRegistration() {
  const responseOfVerifyRegistration = useSelector(
    (state) => state.alterationsResponse.unique.verifyRegistration || {}
  )

  const dispatch = useDispatch()

  const [searchParams, _] = useSearchParams()

  const { user_id, timestamp, signature } = Object.fromEntries(
    searchParams.entries()
  )

  useEffect(
    () => {
      // send verify registration immediately
      dispatch(verifyRegistration(user_id, timestamp, signature))
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [user_id, timestamp, signature]
  )

  let content
  let className
  switch (responseOfVerifyRegistration.status) {
    case Status.successful:
      content = (
        <div className="flow">
          <p>Email successfuly validated.</p>
          <p>
            A manager will validate your account, you&apos;ll be notified by
            email.
          </p>
        </div>
      )
      className = 'success'
      break

    case Status.failed: {
      let message
      if (responseOfVerifyRegistration.message) {
        message = <p>Reason: {responseOfVerifyRegistration.message}</p>
      }

      content = (
        <div className="flow">
          <p>Error validating email.</p>
          {message}
        </div>
      )
      className = 'danger'
      break
    }

    default:
      content = (
        <div className="flow">
          <p>Validating...</p>
        </div>
      )
      className = 'success'
  }

  return (
    <div id="verify-registration" className={classNames('box', className)}>
      <title>Dakara verification</title>
      <div className="header">
        <h2>Email verification</h2>
      </div>
      {content}
    </div>
  )
}
