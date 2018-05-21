import React, { Component } from 'react'
import { version, homepage, bugs } from 'package.json'

class Footer extends Component {
    render() {
        return (
            <footer id="footer" className="box">
                <h2>
                    Dakara client <span className="version">{version}</span>
                </h2>
                <div className="contact">
                    <p className="project">
                        Visit the <a className="external" href={homepage}>project page</a>
                    </p>
                    <p className="bug">
                        Report a <a className="external" href={bugs.url}>bug</a>
                    </p>
                </div>
            </footer>
        )
    }
}

export default Footer
