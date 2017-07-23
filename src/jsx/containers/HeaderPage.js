import { connect } from 'react-redux'
import Header from '../components/Header'

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token,
    user: state.users
})

const HeaderPage = connect(
    mapStateToProps
)(Header)

export default HeaderPage
