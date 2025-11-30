import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

import { getUsers } from 'actions/users'
import { FormBlock, InputField } from 'components/generics/Form'
import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Navigator from 'components/generics/Navigator'
import UserEntry from 'components/settings/users/Entry'
import { IsUserManager } from 'permissions/components/Users'
import { Status } from 'reducers/alterationsResponse'

export default function UsersList() {
  const listUsersState = useSelector((state) => state.settings.users.list)
  const user = useSelector((state) => state.authenticatedUser)
  const { status: listUsersStatus } = listUsersState

  const [searchParams, _] = useSearchParams()
  const { page } = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()

  const refreshEntries = useCallback(
    () => {
      dispatch(getUsers(page))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page]
  )

  useEffect(
    () => {
      // refresh the users immediately and if the page changes
      if (listUsersStatus !== Status.pending) {
        refreshEntries()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page]
  )

  const { users, pagination } = listUsersState.data

  const userList = users.map((user) => <UserEntry key={user.id} user={user} />)

  return (
    <div id="users-list">
      <ListingFetchWrapper status={listUsersStatus}>
        <div className="listing-table-container">
          <table className="listing users-list notifiable">
            <thead>
              <tr className="listing-header">
                <th className="notification-col"></th>
                <th className="username">User&shy;name</th>
                <IsUserManager user={user}>
                  <th className="validated">Email check</th>
                  <th className="validated">Manager check</th>
                </IsUserManager>
                <th className="superuser">Super&shy;user</th>
                <th className="permission">Users rights</th>
                <th className="permission">Library rights</th>
                <th className="permission">Playlist rights</th>
                <th className="controls-col"></th>
              </tr>
            </thead>
            <tbody>{userList}</tbody>
          </table>
        </div>
      </ListingFetchWrapper>
      <Navigator
        count={users.length}
        pagination={pagination}
        names={{
          singular: 'user',
          plural: 'users',
        }}
      />
      <IsUserManager user={user}>
        <div className="create-user flow">
          <FormBlock
            title="Create user"
            submitText="Create"
            alterationName="createUser"
            action="users/"
            successMessage="User sucessfully created!"
            onSuccess={() => {
              refreshEntries()
            }}
          >
            <InputField id="username" label="Username" required />
            <InputField
              id="email"
              label="Email"
              required
              validate={(value) => {
                if (!/\S+@\S+\.\S+/.test(value.toLowerCase())) {
                  return ['This should be a valid email address.']
                }
              }}
            />
            <InputField
              id="password"
              type="password"
              label="Password"
              required
            />
            <InputField
              id="confirm_password"
              type="password"
              label="Confirm password"
              required
              validate={(value, values) => {
                if (values.password !== value) {
                  return ['This field should match password field.']
                }
              }}
              ignore
            />
          </FormBlock>
        </div>
      </IsUserManager>
    </div>
  )
}
