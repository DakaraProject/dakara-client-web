import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Navigate, NavLink } from 'react-router'

import { FormBlock, InputField } from 'components/generics/Form'
import { withLocation } from 'thirdpartyExtensions/ReactRouterDom'

class Login extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    serverSettings: PropTypes.object,
  }

  render() {
    const { isLoggedIn, serverSettings } = this.props

    if (isLoggedIn) {
      const queryObj = queryString.parse(this.props.location.search)
      const from = queryObj.from || '/'
      return <Navigate to={from} replace />
    }

    let forgottenPasswordLink
    if (serverSettings?.email_enabled) {
      forgottenPasswordLink = (
        <span>
          {' '}
          Or{' '}
          <NavLink to="/send-reset-password-link">
            reset your password
          </NavLink>{' '}
          if you have forgotten it.
        </span>
      )
    }

    return (
      <div id="login">
        <div id="login-form" className="box primary">
          <div className="header">
            <h2>Login</h2>
          </div>
          <div className="content">
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
          </div>
        </div>
        <div id="login-links" className="box">
          <p className="content">
            New here? Create a <NavLink to="/register">new account</NavLink>.
            {forgottenPasswordLink}
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.token,
  serverSettings: state.internal.serverSettings,
})

Login = withLocation(connect(mapStateToProps)(Login))

export default Login
