import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { deleteUser, getUsers } from 'actions/users'
import { FormBlock, InputField } from 'components/generics/Form'
import ListingFetchWrapper from 'components/generics/listing/FetchWrapper'
import Navigator from 'components/generics/Navigator'
import SettingsUserEntry from 'components/settings/users/Entry'
import { IsUserManager } from 'permissions/Users'
import { listUsersStatePropType } from 'reducers/users'
import { withSearchParams } from 'thirdpartyExtensions/ReactRouterDom'

class UsersList extends Component {
  static propTypes = {
    clearAlteration: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    listUsersState: listUsersStatePropType.isRequired,
    responseOfMultipleDeleteUser: PropTypes.object,
    searchParams: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.refreshEntries()
  }

  componentDidUpdate(prevProps) {
    const { searchParams } = this.props
    const { searchParams: prevSearchParams } = prevProps

    // refresh if moved to a different page
    const page = searchParams.get('page')
    const prevPage = prevSearchParams.get('page')
    if (page !== prevPage) {
      this.refreshEntries()
    }
  }

  refreshEntries = () => {
    this.props.getUsers(this.props.searchParams.get('page') || 1)
  }

  render() {
    const { deleteUser, clearAlteration, responseOfMultipleDeleteUser } =
      this.props
    const { users, pagination } = this.props.listUsersState.data

    const userList = users.map((user) => (
      <SettingsUserEntry
        key={user.id}
        user={user}
        responseOfDelete={responseOfMultipleDeleteUser[user.id]}
        deleteUser={deleteUser}
        clearAlteration={clearAlteration}
      />
    ))

    return (
      <div id="users-list">
        <ListingFetchWrapper status={this.props.listUsersState.status}>
          <div className="listing-table-container">
            <table className="listing users-list notifiable">
              <thead>
                <tr className="listing-header">
                  <th className="notification-col"></th>
                  <th className="username">User&shy;name</th>
                  <IsUserManager>
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
        <IsUserManager>
          <div className="create-user flow">
            <FormBlock
              title="Create user"
              submitText="Create"
              alterationName="createUser"
              action="users/"
              successMessage="User sucessfully created!"
              onSuccess={this.refreshEntries}
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
}

const mapStateToProps = (state) => ({
  listUsersState: state.settings.users.list,
  responseOfMultipleDeleteUser:
    state.alterationsResponse.multiple.deleteUser || {},
})

UsersList = withSearchParams(
  connect(mapStateToProps, {
    deleteUser,
    getUsers,
    clearAlteration,
  })(UsersList)
)

export default UsersList
