import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'
import SongPageList from './SongPageList'

class App extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/library/songs" activeStyle={{ color: 'red' }}>Songs</Link></li>
                    <li><Link to="/library/artists" activeStyle={{ color: 'red' }}>Artists</Link></li>
                    <li><Link to="/library/animes" activeStyle={{ color: 'red' }}>Animes</Link></li>
                    <li><Link to="/library/games" activeStyle={{ color: 'red' }}>Games</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
}

export default App
