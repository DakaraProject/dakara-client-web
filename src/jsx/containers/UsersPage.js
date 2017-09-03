import { connect } from 'react-redux'
import Users from '../components/Users'
import { deleteUser, getUsers } from '../actions'

const mapStateToProps = (state) => ({
    entries: state.users.entries,
    notifications: state.users.notifications
})

const UsersPage = connect(
    mapStateToProps,
    { deleteUser, getUsers }
)(Users)

export default UsersPage
