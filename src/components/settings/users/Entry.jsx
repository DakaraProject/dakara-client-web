import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'

import { clearAlteration } from 'actions/alterations'
import { deleteUser } from 'actions/users'
import ConfirmationBar from 'components/generics/ConfirmationBar'
import Notification, {
  NotifiableForTable,
} from 'components/generics/Notification'
import { IsNotSelf, IsUserManager } from 'permissions/components/Users'
import { userPropType } from 'serverPropTypes/users'
import { CSSTransitionLazy } from 'thirdpartyExtensions/ReactTransitionGroup'

import Marked from './Marked'
import PermissionText from './PermissionText'

export default function UsersEntry({ user }) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <tr className="listing-entry user-listing-entry listable hoverizable">
      <td className="notification-col">
        <NotifiableForTable>
          <CSSTransitionLazy
            in={confirmDisplayed}
            classNames="notified"
            timeout={{
              enter: 300,
              exit: 150,
            }}
          >
            <ConfirmationBar
              onConfirm={() => {
                dispatch(deleteUser(user.id))
              }}
              onCancel={() => {
                setConfirmDisplayed(false)
              }}
            />
          </CSSTransitionLazy>
          <Notification
            alterationResponse={responseOfDelete}
            pendingMessage="Deleting…"
            successfulMessage="Successfuly deleted!"
            successfulDuration={null}
            failedMessage="Error attempting to delete user"
          />
        </NotifiableForTable>
      </td>
      <td className="username">{user.username}</td>
      <IsUserManager user={authenticatedUser}>
        <td className="validated">
          <Marked marked={user.validated_by_email} />
        </td>
        <td className="validated">
          <Marked marked={user.validated_by_manager} />
        </td>
      </IsUserManager>
      <td className="superuser">
        <Marked marked={user.is_superuser} />
      </td>
      <td className="permission">
        <PermissionText level={user.users_permission_level} />
      </td>
      <td className="permission">
        <PermissionText level={user.library_permission_level} />
      </td>
      <td className="permission last">
        <PermissionText level={user.playlist_permission_level} />
      </td>
      <td className="controls-col">
        <IsUserManager user={authenticatedUser}>
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
        </IsUserManager>
      </td>
    </tr>
  )
}

UsersEntry.propTypes = {
  user: userPropType.isRequired,
}
