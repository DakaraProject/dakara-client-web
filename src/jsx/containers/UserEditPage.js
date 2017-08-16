import { connect } from 'react-redux'
import UserEdit from '../components/UserEdit'
import { getUser, clearUser, updateUser, clearForm } from '../actions'

const mapStateToProps = (state) => ({
    user: state.users.userEdit,
})

const UserEditPage = connect(
    mapStateToProps,
    { getUser, clearUser, updateUser, clearForm }
)(UserEdit)

export default UserEditPage
