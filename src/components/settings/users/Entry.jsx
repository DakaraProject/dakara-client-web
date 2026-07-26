import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'

import { clearAlteration } from 'actions/alterations'
import { deleteUser } from 'actions/users'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import NotificationBar, {
  NotifiableForTable,
} from 'components/generics/NotificationBar'
import PermissionText from 'components/generics/PermissionText'
import { Checkmark } from 'components/generics/Shapes'
import { IsNotSelf, IsUsersManager } from 'permissions/components/Users'
import { userPropType } from 'serverPropTypes/users'

export default function UsersEntry({ user }) {
  const query = useSelector((state) => state.settings.users.list.data.query)
  const responseOfDelete = useSelector(
    (state) => state.alterationsResponse.multiple.deleteUser?.[user.id]
  )
  const authenticatedUser = useSelector((state) => state.authenticatedUser)

  const [confirmDisplayed, setConfirmDisplayed] = useState(false)

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      // clean alteration when component unmounts
      dispatch(clearAlteration('deleteUser', user.id))
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    []
  )

  return (
    <tr className="listing-entry user-listing-entry listable hoverizable">
      <td className="notification-col">
        <NotifiableForTable>
          <ConfirmationBar
            show={confirmDisplayed}
            setShow={setConfirmDisplayed}
            onConfirm={() => {
              dispatch(deleteUser(user.id))
            }}
          />
          <NotificationBar
            alterationResponse={responseOfDelete}
            pendingMessage="Deleting…"
            successfulMessage="Successfuly deleted!"
            successfulDuration={null}
            failedMessage="Error attempting to delete user"
          />
        </NotifiableForTable>
      </td>
      <td className="username">
        <HighlighterQuery
          query={query}
          searchWords={(q) => q.remaining}
          textToHighlight={user.username}
        />
      </td>
      <IsUsersManager user={authenticatedUser}>
        <td className="validated">
          <Checkmark enabled={user.validated_by_email} />
        </td>
        <td className="validated">
          <Checkmark enabled={user.validated_by_manager} />
        </td>
      </IsUsersManager>
      <td className="superuser">
        <Checkmark enabled={user.is_superuser} />
      </td>
      <td className="permission">
        <PermissionText level={user.users_permission_level} truncatable />
      </td>
      <td className="permission">
        <PermissionText level={user.library_permission_level} truncatable />
      </td>
      <td className="permission last">
        <PermissionText level={user.playlist_permission_level} truncatable />
      </td>
      <td className="controls-col">
        <IsUsersManager user={authenticatedUser}>
          <div className="controls compact">
            <IsNotSelf user={authenticatedUser} other={user} disable>
              <Link to={`${user.id}`} className="control square info">
                <span className="icon">
                  <i className="las la-pen"></i>
                </span>
              </Link>
              <button
                className="control square danger"
                onClick={() => {
                  setConfirmDisplayed(true)
                }}
              >
                <span className="icon">
                  <i className="las la-trash"></i>
                </span>
              </button>
            </IsNotSelf>
          </div>
        </IsUsersManager>
      </td>
    </tr>
  )
}

UsersEntry.propTypes = {
  user: userPropType.isRequired,
}
