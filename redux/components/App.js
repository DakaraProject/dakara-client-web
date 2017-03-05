import React, { Component } from 'react'
import SongPageList from '../containers/SongPageList'
import { connect } from 'react-redux'
import { loadSongs } from '../actions'

class App extends Component {
    componentDidMount() {
        this.props.loadSongs()
    }

    render() {
        return (
          <div>
              <SongPageList />
          </div>
        )
    }
}

export default connect(() => ({}), {
  loadSongs,
})(App)

