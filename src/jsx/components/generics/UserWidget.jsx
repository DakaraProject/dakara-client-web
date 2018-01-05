import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

class UserWidget extends Component {

    render() {
        const { user, currentUser, className } = this.props
        const isCurrentUser = currentUser && currentUser.id == user.id

        const iconClass = isCurrentUser ? "fa fa-user" : "fa fa-user-o"
        const userWidgetClass = classNames(
            'user-widget',
            classNames || ''
        )

        return (
            <div className={userWidgetClass}>
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
