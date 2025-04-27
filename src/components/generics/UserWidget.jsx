import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { userPropType } from 'serverPropTypes/users'

class UserWidget extends Component {
  static propTypes = {
    currentUser: userPropType.isRequired,
    user: userPropType.isRequired,
    truncatable: PropTypes.bool,
  }

  render() {
    const { user, currentUser, truncatable } = this.props
    const isCurrentUser = currentUser && currentUser.id === user.id

    return (
      <div className={classNames('user-widget', { truncatable })}>
        <span className="icon">
          <i
            className={isCurrentUser ? 'las la-user' : 'las la-user-friends'}
          ></i>
        </span>
        <span className="name">{user.username}</span>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.authenticatedUser,
})

UserWidget = connect(mapStateToProps)(UserWidget)

export default UserWidget
