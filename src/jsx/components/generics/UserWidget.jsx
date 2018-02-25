import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class UserWidget extends Component {
    static propTypes = {
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            id: PropTypes.any.isRequired,
        }).isRequired,
        currentUser: PropTypes.shape({
            id: PropTypes.any.isRequired,
        }).isRequired,
    }

    render() {
        const { user, currentUser, className } = this.props
        const isCurrentUser = currentUser && currentUser.id == user.id

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
