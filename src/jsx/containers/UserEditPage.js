import { connect } from 'react-redux'
import UserEdit from '../components/UserEdit'
import { getUser, clearUser, updateUser } from '../actions'

const mapStateToProps = (state) => ({
    user: state.users.userEdit,
    formResponse: state.forms.updateUser
})

const UserEditPage = connect(
    mapStateToProps,
    { getUser, clearUser, updateUser }
)(UserEdit)

export default UserEditPage
