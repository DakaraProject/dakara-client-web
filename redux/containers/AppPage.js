import { connect } from 'react-redux'
import App from '../components/App'
import { logout } from '../actions'

const mapStateToProps = (state) => ({
    isLoggedIn: !!state.token
})

const AppPage = connect(
    mapStateToProps,
    {logout}
)(App)

export default AppPage

