import classNames from 'classnames'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { verifyEmail } from 'actions/users'
import { Status } from 'reducers/alterationsResponse'

export default function VerifyEmail() {
  const responseOfVerifyEmail = useSelector(
    (state) => state.alterationsResponse.unique.verifyEmail || {}
  )

  const dispatch = useDispatch()

  const [searchParams, _] = useSearchParams()

  const { user_id, email, timestamp, signature } = Object.fromEntries(
    searchParams.entries()
  )

  useEffect(
    () => {
      // send verify requerst immediately
      dispatch(verifyEmail(user_id, email, timestamp, signature))
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [user_id, email, timestamp, signature]
  )

  let content
  let className
  switch (responseOfVerifyEmail.status) {
    case Status.successful:
      content = (
        <div className="flow">
          <p>Email successfuly validated.</p>
        </div>
      )
      className = 'success'
      break

    case Status.failed: {
      let message
      if (responseOfVerifyEmail.message) {
        message = <p>Reason: {responseOfVerifyEmail.message}</p>
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
    <div id="verify-email" className={classNames('box', className)}>
      <title>Dakara verification</title>
      <div className="header">
        <h2>Email verification</h2>
      </div>
      {content}
    </div>
  )
}
