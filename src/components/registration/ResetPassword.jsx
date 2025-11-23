import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, NavLink, useSearchParams } from 'react-router'

import { FormBlock, InputField } from 'components/generics/Form'

export default function ResetPassword() {
  const isLoggedIn = useSelector((state) => !!state.token)

  const [emailSent, setEmailSent] = useState(false)

  const [searchParams, _] = useSearchParams()

  const { user_id, timestamp, signature } = Object.fromEntries(
    searchParams.entries()
  )

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const resetPasswordForm = (
    <FormBlock
      action="accounts/reset-password/"
      submitText="Reset password"
      alterationName="resetPassword"
      successMessage={false}
      pendingMessage={false}
      formatValues={(values) => ({
        user_id,
        timestamp,
        signature,
        ...values,
      })}
      onSuccess={() => {
        setEmailSent(true)
      }}
    >
      <InputField id="password" type="password" label="Password" required />
      <InputField
        id="password_confirm"
        type="password"
        label="Confirm password"
        required
        validate={(value, values) => {
          if (values.password !== value) {
            return ['This field should match password field.']
          }
        }}
      />
    </FormBlock>
  )

  const emailSentMessage = (
    <p>
      Password reset successful, you can now{' '}
      <NavLink to="/login">login</NavLink>.
    </p>
  )

  return (
    <div id="reset-password" className="box neutral">
      <div className="header primary">
        <h2>Reset password</h2>
      </div>
      <div className="flow">
        {emailSent ? emailSentMessage : resetPasswordForm}
      </div>
    </div>
  )
}
