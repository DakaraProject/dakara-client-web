import React, { Component } from 'react'
import {version} from 'package.json'

class Footer extends Component {
    render() {
        return (
            <footer id="footer" className="box">
                <h2>
                    Dakara client <span className="version">{version}</span>
                </h2>
            </footer>
        )
    }
}

export default Footer
