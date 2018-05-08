import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
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
            <div id="login" className="box">
                <FormBlock
                    action="token-auth/"
                    title="Login"
                    submitText="Login"
                    formName="login"
                    successMessage={false}
                    pendingMessage={false}
                >
                    <InputField
                        id="username"
                        label={(
                            <span className="icon">
                                <i className="fa fa-user"></i>
                            </span>
                        )}
                        placeholder="Username..."
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
