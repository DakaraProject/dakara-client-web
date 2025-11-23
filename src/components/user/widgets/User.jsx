import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { userPropType } from 'serverPropTypes/users'

export default function UserWidget({ user, truncatable }) {
  const currentUser = useSelector((state) => state.authenticatedUser)

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

UserWidget.propTypes = {
  user: userPropType.isRequired,
  truncatable: PropTypes.bool,
}
