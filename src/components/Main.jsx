import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadCurrentUser } from 'actions/authenticatedUser'
import { loadServerSettings } from 'actions/internal'
import DevWarning from 'components/DevWarning'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Karaoke from 'components/karaoke/Karaoke'
import { IsAuthenticated } from 'permissions/Base'

class Main extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    loadCurrentUser: PropTypes.func.isRequired,
    loadServerSettings: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    this.props.loadServerSettings()

    if (this.props.isLoggedIn) {
      this.props.loadCurrentUser()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLoggedIn && !prevProps.isLoggedIn) {
      this.props.loadCurrentUser()
    }
  }

  render() {
    return (
      <div id="main">
        <DevWarning />
        <div className="column">
          <Header />
          <IsAuthenticated>
            <Karaoke />
          </IsAuthenticated>
          <div className="content">{this.props.children}</div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: !!state.token,
})

Main = connect(mapStateToProps, {
  loadCurrentUser,
  loadServerSettings,
})(Main)

export default Main
