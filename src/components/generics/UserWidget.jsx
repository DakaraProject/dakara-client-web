import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { userPropType } from 'serverPropTypes/users'

class UserWidget extends Component {
    static propTypes = {
        currentUser: userPropType.isRequired,
        noResize: PropTypes.bool,
        user: userPropType.isRequired,
        className: PropTypes.string,
    }

    render() {
        const { user, currentUser, className, noResize } = this.props
        const isCurrentUser = currentUser && currentUser.id === user.id

        const iconClass = isCurrentUser ? 'las la-user' : 'las la-user-friends'
        const userWidgetClass = classNames(
            'user-widget',
            className,
            {
                'no-resize': noResize
            }
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
