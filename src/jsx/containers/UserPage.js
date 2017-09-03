import { connect } from 'react-redux'
import User from '../components/User'

const mapStateToProps = (state) => ({
    user: state.authenticatedUsers,
})

const UserPage = connect(
    mapStateToProps,
)(User)

export default UserPage
