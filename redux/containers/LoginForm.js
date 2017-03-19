import React from 'react'
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

        return (
            <div>
                <form onSubmit={e => {
                    e.preventDefault()
                    login(username.value, password.value)
                }}>
                    <input ref={node => {
                        username = node
                    }} />
                    <input type="password" ref={node => {
                        password = node
                    }} />
                    <button type="submit">
                        Login
                    </button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

LoginForm = connect(
    mapStateToProps, 
    { login }
)(LoginForm)

export default LoginForm
