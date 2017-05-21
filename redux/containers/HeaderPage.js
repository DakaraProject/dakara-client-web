import { connect } from 'react-redux'
import Header from '../components/Header'

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

const HeaderPage = connect(
    mapStateToProps
)(Header)

export default HeaderPage
