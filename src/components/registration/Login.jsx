import { useSelector } from 'react-redux'
import { Navigate, NavLink, useSearchParams } from 'react-router'

import { FormBlock, InputField } from 'components/generics/Form'

export default function Login() {
  const isLoggedIn = useSelector((state) => !!state.token)
  const serverSettings = useSelector((state) => state.internal.serverSettings)

  const [searchParams, _] = useSearchParams()

  if (isLoggedIn) {
    return <Navigate to={searchParams.get('from') || '/'} replace />
  }

  let forgottenPasswordLink
  if (serverSettings?.email_enabled) {
    forgottenPasswordLink = (
      <span>
        {' '}
        Or <NavLink to="/send-reset-password-link">
          reset your password
        </NavLink>{' '}
        if you have forgotten it.
      </span>
    )
  }

  return (
    <div id="login" className="box primary">
      <title>Dakara login</title>
      <div className="header">
        <h2>Login</h2>
      </div>
      <div className="flow">
        <FormBlock
          action="accounts/login/"
          submitText="Login"
          alterationName="login"
          successMessage={false}
          pendingMessage={false}
        >
          <InputField
            id="login"
            label={
              <span className="icon">
                <i className="las la-user"></i>
              </span>
            }
            required
          />
          <InputField
            id="password"
            label={
              <span className="icon">
                <i className="las la-lock"></i>
              </span>
            }
            type="password"
            required
          />
        </FormBlock>
        <p className="links">
          New here? Create a <NavLink to="/register">new account</NavLink>.
          {forgottenPasswordLink}
        </p>
      </div>
    </div>
  )
}
