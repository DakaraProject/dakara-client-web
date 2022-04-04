import classNames from 'classnames'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { userPropType } from 'serverPropTypes/users'

class UserWidget extends Component {
    static propTypes = {
        currentUser: userPropType.isRequired,
        user: userPropType.isRequired,
    }

    render() {
        const { user, currentUser, className } = this.props
        const isCurrentUser = currentUser && currentUser.id === user.id

        const iconClass = isCurrentUser ? 'las la-user' : 'las la-user-friends'
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
