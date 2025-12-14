import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

import { FormBlock, InputField } from 'components/generics/Form'

export default function Register() {
  const isLoggedIn = useSelector((state) => !!state.token)
  const serverSettings = useSelector((state) => state.internal.serverSettings)

  const [created, setCreated] = useState(false)

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const registerForm = (
    <FormBlock
      action="accounts/register/"
      submitText="Register"
      alterationName="register"
      successMessage={false}
      pendingMessage={false}
      onSuccess={() => {
        setCreated(true)
      }}
    >
      <InputField id="username" label="Username" required />
      <InputField
        id="email"
        label="Email"
        required
        validate={(value) => {
          if (!/\S+@\S+\.\S+/.test(value.toLowerCase())) {
            return ['This should be a valid email address.']
          }
        }}
      />
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

  let createdMessage
  if (serverSettings?.email_enabled) {
    createdMessage = (
      <p>Your account was successfully created, please check your email.</p>
    )
  } else {
    createdMessage = (
      <p>
        Your account was successfully created. A manager will validate your
        account before you can login.
      </p>
    )
  }

  return (
    <div id="register" className="box neutral">
      <div className="header primary">
        <h2>Create a new account</h2>
      </div>
      <div className="flow">{created ? createdMessage : registerForm}</div>
    </div>
  )
}
