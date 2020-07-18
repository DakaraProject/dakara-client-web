import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { userPropType } from 'serverPropTypes/users'

class UserWidget extends Component {
    static propTypes = {
        user: userPropType.isRequired,
        currentUser: userPropType.isRequired,
    }

    render() {
        const { user, currentUser, className } = this.props
        const isCurrentUser = currentUser && currentUser.id === user.id

        const iconClass = isCurrentUser ? "fa fa-user" : "fa fa-user-o"
        const userWidgetClass = classNames(
            'user-widget',
            className
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
    currentUser: state.authenticatedUser
})

UserWidget = connect(
    mapStateToProps
)(UserWidget)

export default UserWidget
