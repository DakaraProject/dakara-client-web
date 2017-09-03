import { connect } from 'react-redux'
import UserEdit from '../components/UserEdit'
import { getUser, clearUser } from '../actions'

const mapStateToProps = (state) => ({
    user: state.users.userEdit,
    authenticatedUser: state.authenticatedUsers
})

const UserEditPage = connect(
    mapStateToProps,
    { getUser, clearUser }
)(UserEdit)

export default UserEditPage
