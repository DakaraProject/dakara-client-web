import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { userPropType } from 'serverPropTypes/users'

export default function UserWidget({ user, query, truncatable }) {
  const currentUser = useSelector((state) => state.authenticatedUser)

  const isCurrentUser = currentUser && currentUser.id === user.id

  return (
    <div className={classNames('user-widget', { truncatable })}>
      <span className="icon">
        <i
          className={isCurrentUser ? 'las la-user' : 'las la-user-friends'}
        ></i>
      </span>
      <HighlighterQuery
        query={query}
        className="name"
        searchWords={(q) => q.owner.contains.concat(q.remaining)}
        textToHighlight={user.username}
      />
    </div>
  )
}

UserWidget.propTypes = {
  user: userPropType.isRequired,
  query: PropTypes.object,
  truncatable: PropTypes.bool,
}
