import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router'

import { FormBlock, InputField } from 'components/generics/Form'

class SendResetPasswordLink extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
  }

  state = {
    emailSent: false,
  }

  render() {
    const { isLoggedIn } = this.props

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
        onSuccess={() => this.setState({ emailSent: true })}
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
      <div id="send-reset-password-link" className="box">
        <div className="header">
          <h2>Send reset password link</h2>
        </div>
        <div className="content">
          {this.state.emailSent ? emailSentMessage : sendResetPasswordLinkForm}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.token,
})

SendResetPasswordLink = connect(mapStateToProps)(SendResetPasswordLink)

export default SendResetPasswordLink
