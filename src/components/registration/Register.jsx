import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { FormBlock, InputField } from 'components/generics/Form'

class Register extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        serverSettings: PropTypes.object
    }

    state = {
       created: false
    }

    render() {
        const { isLoggedIn, serverSettings } = this.props

        if (isLoggedIn) {
            return (
                    <Navigate to="/" replace />
            )
        }

        const registerForm = (
            <FormBlock
                action="accounts/register/"
                submitText="Register"
                alterationName="register"
                successMessage={false}
                pendingMessage={false}
                onSuccess={() => this.setState({created: true})}
            >
                <InputField
                    id="username"
                    label="Username"
                    required
                />
                <InputField
                    id="email"
                    label="Email"
                    required
                    validate={(value) => {
                        if(!/\S+@\S+\.\S+/.test(value.toLowerCase())) {
                            return ['This should be a valid email address.']
                        }
                    }}
                />
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

        let createdMessage
        if (serverSettings?.email_enabled) {
            createdMessage = (
                <p>Your account was successfully created, please check your email.</p>
            )
        } else {
            createdMessage = (
                <p>
                    Your account was successfully created.
                    A manager will validate your account before you can login.
                </p>
            )
        }

        return (
            <div id="register" className="box">
                <div className="header">
                    <h2>Create a new account</h2>
                </div>
                <div className="content">
                    { this.state.created ? createdMessage : registerForm }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    serverSettings: state.internal.serverSettings
})

Register = connect(
    mapStateToProps,
)(Register)

export default Register
