import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Navigate, NavLink, useSearchParams } from 'react-router'

import { InputField } from 'components/generics/form/Fields'
import { Form } from 'components/generics/form/Form'

function ForgottenPasswordLink() {
  return (
    <span>
      Or <NavLink to="/send-reset-password-link">reset your password</NavLink>{' '}
      if you have forgotten it.
    </span>
  )
}

export default function Login() {
  const isLoggedIn = useSelector((state) => !!state.token)
  const serverSettings = useSelector((state) => state.internal.serverSettings)

  const [searchParams, _] = useSearchParams()

  const {
    register,
    formState: { errors },
    control,
  } = useForm()

  if (isLoggedIn) {
    return <Navigate to={searchParams.get('from') || '/'} replace />
  }

  return (
    <div id="login" className="box primary">
      <div className="header">
        <h2>Login</h2>
      </div>
      <div className="flow">
        <Form action="api/accounts/login/" submitText="Login" control={control}>
          <InputField
            id="login"
            label={
              <span className="icon">
                <i className="las la-user"></i>
              </span>
            }
            register={register}
            errors={errors}
            validation={{ required: true }}
          />
          <InputField
            id="password"
            label={
              <span className="icon">
                <i className="las la-lock"></i>
              </span>
            }
            type="password"
            register={register}
            errors={errors}
            validation={{ required: true }}
          />
        </Form>
        <p className="links">
          New here? Create a <NavLink to="/register">new account</NavLink>.
          {serverSettings?.email_enabled && (
            <>
              {' '}
              <ForgottenPasswordLink />
            </>
          )}
        </p>
      </div>
    </div>
  )
}
