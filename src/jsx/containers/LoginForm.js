import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { login } from '../actions'

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

        let message
        if (formResponse) {
            message = (
                        <div className="notified">
                            <div
                                className={"notification message " +
                                    formResponse.type}
                            >
                                {formResponse.message}
                            </div>
                        </div>
                    )
        }

        return (
            <div id="login" className="box">
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        login(username.value, password.value)
                    }}
                    className="form block"
                >
                    <div className="header notifiable">
                        <h2>Login</h2>
                        <ReactCSSTransitionGroup
                            transitionName="notified"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={150}
                        >
                            {message}
                        </ReactCSSTransitionGroup>
                    </div>
                    <div className="set">
                        <div className="field">
                            <label htmlFor="username">
                                <span className="icon">
                                    <i className="fa fa-user"></i>
                                </span>
                            </label>
                            <div className="input">
                                <input
                                    id="username"
                                    ref={node => {
                                        username = node
                                    }}
                                    placeholder="Username..."
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="password">
                                <span className="icon">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </label>
                            <div className="input">
                                <input
                                    id="password"
                                    type="password"
                                    ref={node => {
                                        password = node
                                    }}
                                    placeholder="Password..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="controls">
                        <button type="submit" className="control primary">
                            Login
                        </button>
                    </div>
                </form>
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
