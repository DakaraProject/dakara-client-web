import { connect } from 'react-redux'
import Header from '../components/Header'
import { logout } from '../actions'

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

const HeaderPage = connect(
    mapStateToProps,
    { logout }
)(Header)

export default HeaderPage
