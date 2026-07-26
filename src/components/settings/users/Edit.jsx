import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router'

import { clearUser, getUser } from 'actions/users'
import {
  CheckboxField,
  FormBlock,
  InputField,
  SelectField,
} from 'components/generics/Form'
import Forbidden from 'components/navigation/Forbidden'
import NotFound from 'components/navigation/NotFound'
import { isNotSelf, isUsersManager } from 'permissions/users'
import { Status } from 'reducers/alterationsResponse'

export default function UsersEdit() {
  const editUsersState = useSelector((state) => state.settings.users.edit)
  const authenticatedUser = useSelector((state) => state.authenticatedUser)
  const serverSettings = useSelector((state) => state.internal.serverSettings)

  const params = useParams()
  const { userId } = params

  const location = useLocation()
  const navigate = useNavigate()

  const dispatch = useDispatch()

  useEffect(
    () => {
      // load user immediately
      dispatch(getUser(userId))

      return () => {
        // unload user when component unmounts
        dispatch(clearUser())
      }
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    []
  )

  const { user } = editUsersState.data

  // render nothing if the user is being fetched
  if (editUsersState.status === Status.pending) {
    return null
  }

  // render an error page if the current user has no right to display the page
  const fakeUser = { id: userId }
  if (
    !(
      isUsersManager(authenticatedUser) &&
      isNotSelf(authenticatedUser, fakeUser)
    )
  ) {
    return <Forbidden location={location} />
  }

  // render an error page if the requested user does not exist
  if (!user) {
    return <NotFound location={location} />
  }

  let passwordField
  let passwordConfirmField
  if (serverSettings && !serverSettings.email_enabled) {
    passwordField = (
      <InputField
        id="password"
        type="password"
        label="Password"
        ignoreIfEmpty
      />
    )
    passwordConfirmField = (
      <InputField
        id="confirm_password"
        type="password"
        label="Confirm password"
        validate={(value, values) => {
          if (values.password !== value) {
            return ['This field should match password field.']
          }
        }}
        ignore
      />
    )
  }

  // back button
  const backButton = (
    <button key="back" className="control primary" onClick={() => navigate(-1)}>
      Return
    </button>
  )

  return (
    <div id="users-edit" className="flow">
      <FormBlock
        title={`Edit user “${user.username}”`}
        action={`users/${user.id}/`}
        method="PATCH"
        submitText="Edit"
        alterationName="updateUser"
        successMessage="User sucessfully updated!"
        noClearOnSuccess
        extraControls={[backButton]}
      >
        <InputField
          id="username"
          label="Username"
          defaultValue={user.username}
          disabled
          ignore
        />
        <InputField
          id="email"
          label="E-mail"
          defaultValue={user.email}
          disabled
          ignore
        />
        {passwordField}
        {passwordConfirmField}
        <CheckboxField
          id="validated_by_email"
          label="Validated by email"
          defaultValue={user.validated_by_email}
          disabled
          ignore
        />
        <CheckboxField
          id="validated_by_manager"
          label="Validated by manager"
          defaultValue={user.validated_by_manager}
        />
        <CheckboxField
          id="is_superuser"
          label="Superuser"
          defaultValue={user.is_superuser}
          disabled
          ignore
        />
        <SelectField
          id="users_permission_level"
          label="Users rights"
          defaultValue={user.users_permission_level}
          options={[
            { value: null, name: 'None' },
            { value: 'u', name: 'User' },
            { value: 'm', name: 'Manager' },
          ]}
        />
        <SelectField
          id="library_permission_level"
          label="Library rights"
          defaultValue={user.library_permission_level}
          options={[
            { value: null, name: 'None' },
            { value: 'u', name: 'User' },
            { value: 'm', name: 'Manager' },
          ]}
        />
        <SelectField
          id="playlist_permission_level"
          label="Playlist rights"
          defaultValue={user.playlist_permission_level}
          options={[
            { value: null, name: 'None' },
            { value: 'u', name: 'User' },
            { value: 'm', name: 'Manager' },
          ]}
        />
      </FormBlock>
    </div>
  )
}
