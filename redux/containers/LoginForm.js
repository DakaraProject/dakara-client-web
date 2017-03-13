import React from 'react'
import { connect } from 'react-redux'
import { login } from '../actions'

let LoginForm = ({ dispatch }) => {
    let username
    let password

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault()
                dispatch(login(username.value, password.value))
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

LoginForm = connect()(LoginForm)

export default LoginForm
