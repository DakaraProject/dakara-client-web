import React, { Component } from 'react'
import { connect } from 'react-redux'

class UserWidget extends Component {

    render() {
        const { user, currentUser, className } = this.props
        const isCurrentUser = currentUser && currentUser.id == user.id

        const iconClass = isCurrentUser ? "fa fa-user" : "fa fa-user-o"

        return (
            <div className={"user-widget" + (className ? " " + className : "")}>
                <span className="icon">
                    <i className={iconClass}></i>
                </span>
                {user.username}
            </div>
        )

    }
}

const mapStateToProps = (state) => ({
    currentUser: state.authenticatedUsers
})

UserWidget = connect(
    mapStateToProps
)(UserWidget)

export default UserWidget
