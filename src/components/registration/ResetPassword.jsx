import PropTypes from 'prop-types'
import { parse } from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Navigate,NavLink } from 'react-router-dom'

import { withLocation } from 'components/adapted/ReactRouterDom'
import { FormBlock, InputField } from 'components/generics/Form'

class ResetPassword extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
    }

    state = {
       emailSent: false
    }

    render() {
        const { isLoggedIn } = this.props
        const queryObj = parse(this.props.location.search)

        const {
            user_id,
            timestamp,
            signature
        } = queryObj

        if (isLoggedIn) {
            return (
                    <Navigate to="/" replace />
            )
        }

        const resetPasswordForm = (
            <FormBlock
                action="accounts/reset-password/"
                submitText="Reset password"
                alterationName="resetPassword"
                successMessage={false}
                pendingMessage={false}
                formatValues={values => ({user_id, timestamp, signature, ...values})}
                onSuccess={() => this.setState({emailSent: true})}
            >
                <InputField
                    id="password"
                    type="password"
                    label="Password"
                    required
                />
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
                Password reset successful, you can now {' '}
                <NavLink to="/login">login</NavLink>.
            </p>
        )

        return (
            <div id="reset-password" className="box">
                <div className="header">
                    <h2>Reset password</h2>
                </div>
                <div className="content">
                    { this.state.emailSent ? emailSentMessage : resetPasswordForm }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
})

ResetPassword = withLocation(connect(
    mapStateToProps,
)(ResetPassword))

export default ResetPassword
