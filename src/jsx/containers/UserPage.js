import { connect } from 'react-redux'
import User from '../components/User'
import { updatePassword, clearForm } from '../actions'

const mapStateToProps = (state) => ({
    user: state.users,
    formResponse: state.forms.updatePassword
})

const UserPage = connect(
    mapStateToProps,
    { updatePassword, clearForm }
)(User)

export default UserPage
