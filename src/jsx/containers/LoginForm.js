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
        const { login } = this.props

        return (
            <div id="login" className="box">
                <FormBlock
                    onSubmit={values => {
                        login(values.username, values.password)
                    }}
                    title="Login"
                    submitText="Login"
                    formName="login"
                >
                    <Field
                        id="username"
                        label={(
                            <span className="icon">
                                <i className="fa fa-user"></i>
                            </span>
                        )}
                        placeholder="Username..."
                        required
                    />
                    <Field
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

LoginForm = connect(
    mapStateToProps,
    { login }
)(LoginForm)

export default LoginForm
