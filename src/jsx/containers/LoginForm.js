import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { login } from '../actions'
import { FormBlock, Field } from '../components/Form.js'

class LoginForm extends Component {
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
        const { login, formResponse } = this.props
        let username
        let password

        return (
            <div id="login" className="box">
                <FormBlock
                    onSubmit={e => {
                        e.preventDefault()
                        login(username.value, password.value)
                    }}
                    title="Login"
                    submitText="Login"
                    response={formResponse}
                >
                    <Field
                        id="username"
                        label={(
                            <span className="icon">
                                <i className="fa fa-user"></i>
                            </span>
                        )}
                        reference={n => {username = n}}
                        placeholder="Username..."
                        response={formResponse}
                    />
                    <Field
                        id="password"
                        label={(
                            <span className="icon">
                                <i className="fa fa-lock"></i>
                            </span>
                        )}
                        reference={n => {password = n}}
                        placeholder="Password..."
                        response={formResponse}
                        type="password"
                    />
                </FormBlock>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    formResponse: state.forms.login
})

LoginForm = connect(
    mapStateToProps, 
    { login }
)(LoginForm)

export default LoginForm
