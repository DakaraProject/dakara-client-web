import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { login } from '../actions'

class LoginForm extends React.Component {
    componentWillMount() {
        if (this.props.isLoggedIn) {
            browserHistory.push("/")
        } 
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextProps.isLoggedIn) {
            browserHistory.push("/")
        }
    }

    render() {
        const { login } = this.props
        let username
        let password

        let message
        if (this.props.message) {
            message = (
                        <div className="notified">
                            <div className="notification warning">
                                {this.props.message}
                            </div>
                        </div>
                    )
        }

        return (
            <div id="login" className="box">
                <div className="page-head">
                </div>
                <form
                    onSubmit={e => {
                        e.preventDefault()
                        login(username.value, password.value)
                    }}
                    className="form block"
                >
                    <div className="header">
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
    message: state.loginPage.message
})

LoginForm = connect(
    mapStateToProps, 
    { login }
)(LoginForm)

export default LoginForm
