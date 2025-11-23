import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

import { FormBlock, InputField } from 'components/generics/Form'

export default function SendResetPasswordLink() {
  const isLoggedIn = useSelector((state) => !!state.token)

  const [emailSent, setEmailSent] = useState(false)

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const sendResetPasswordLinkForm = (
    <FormBlock
      action="accounts/send-reset-password-link/"
      submitText="Send reset password link"
      alterationName="sendResetPasswordLink"
      successMessage={false}
      pendingMessage={false}
      onSuccess={() => {
        setEmailSent(true)
      }}
    >
      <InputField id="login" label="Username or email" required />
    </FormBlock>
  )

  const emailSentMessage = (
    <p>
      An email containing a link to reset your password has been sent
      successfully, please check your email.
    </p>
  )

  return (
    <div id="send-reset-password-link" className="box neutral">
      <div className="header primary">
        <h2>Send reset password link</h2>
      </div>
      <div className="flow">
        {emailSent ? emailSentMessage : sendResetPasswordLinkForm}
      </div>
    </div>
  )
}
