import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, NavLink } from 'react-router-dom'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import { FormBlock, InputField } from 'components/generics/Form'

class Login extends Component {
    static propTypes = {
        isLoggedIn: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
    }

    render() {
        const { isLoggedIn } = this.props

        if (isLoggedIn) {
            const queryObj = parse(this.props.location.search)
            const from = queryObj.from || '/'
            return (
                    <Redirect to={from}/>
            )
        }

        return (
            <div>
                <div id="login-box" className="box">
                    <FormBlock
                        action="accounts/login/"
                        title="Login"
                        submitText="Login"
                        alterationName="login"
                        successMessage={false}
                        pendingMessage={false}
                    >
                        <InputField
                            id="login"
                            label={(
                                <span className="icon">
                                    <i className="fa fa-user"></i>
                                </span>
                            )}
                            placeholder="Username or email..."
                            required
                        />
                        <InputField
                            id="password"
                            label={(
                                <span className="icon">
                                    <i className="fa fa-lock"></i>
                                </span>
                            )}
                            placeholder="Password..."
                            type="password"
                            required
                        />
                    </FormBlock>
                </div>
                <div id="login-links" className="box">
                    <p>
                        {"New here? Create a "}
                        <NavLink to="/register" className="text">
                            new account
                        </NavLink>
                        {". Or "}
                        <NavLink to="/forgot-password" className="text">
                            reset your password
                        </NavLink>
                        {" if you have forgotten it."}
                    </p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
})

Login = connect(
    mapStateToProps,
)(Login)

export default Login
