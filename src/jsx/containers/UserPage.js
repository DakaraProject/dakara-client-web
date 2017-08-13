import { connect } from 'react-redux'
import User from '../components/User'
import { updatePassword } from '../actions'

const mapStateToProps = (state) => ({
    user: state.users,
    message: state.userPage.message
})

const UserPage = connect(
    mapStateToProps,
    { updatePassword }
)(User)

export default UserPage
