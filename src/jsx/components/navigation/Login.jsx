import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { FormBlock, InputField } from 'components/generics/Form'

class Login extends Component {
    redirect = () => {
        const fromUrl = this.props.location.query.from

        if (fromUrl) {
            browserHistory.push(fromUrl)
        } else {
            browserHistory.push("/")
        }
    }

    componentWillMount() {
        if (this.props.isLoggedIn) {
            this.redirect()
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.isLoggedIn) {
            this.redirect()
        }
    }

    render() {
        const { login } = this.props

        return (
            <div id="login" className="box">
                <FormBlock
                    action="token-auth/"
                    title="Login"
                    submitText="Login"
                    formName="login"
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
