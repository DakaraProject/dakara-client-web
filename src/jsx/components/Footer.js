import React, { Component } from 'react'
import {version} from '../../../package.json'

class Footer extends Component {
    render() {
        return (
            <footer className="box">
                <h2>Dakara client</h2>
                <p className="version">{version}</p>
            </footer>
        )
    }
}

export default Footer

