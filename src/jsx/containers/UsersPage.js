import { connect } from 'react-redux'
import Users from '../components/Users'
import { createUser, deleteUser, clearForm, getUsers } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.users.entries,
    notifications: state.users.notifications
})

const UsersPage = connect(
    mapStateToProps,
    { createUser, deleteUser, clearForm, getUsers }
)(Users)

export default UsersPage
