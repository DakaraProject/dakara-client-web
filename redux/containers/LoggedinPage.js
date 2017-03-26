import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'

class LoggedinPage extends Component {
    componentWillMount() {
        if (!this.props.isLoggedIn) {
            browserHistory.push("/login")
        } 
    }

    componentWillUpdate(nextProps, nextState) {
        if(!nextProps.isLoggedIn) {
            browserHistory.push("/login")
        }
    }

    render() {
        return (
            <div>
                <div id="playerbox">player</div>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

LoggedinPage = connect(
    mapStateToProps
)(LoggedinPage)

export default LoggedinPage

