import React, { Component } from 'react'

const {
    npm_package_version: version,
    npm_package_projectHomepage: projectHomepage,
    npm_package_bugs: bugs
} = process.env

class Footer extends Component {
    render() {
        return (
            <footer id="footer" className="box">
                <h2>
                    Dakara client <span className="version">{version}</span>
                </h2>
                <div className="contact">
                    <p className="project">
                        Visit the <a href={projectHomepage}>project page</a>
                    </p>
                    <p className="bug">
                        Report a <a href={bugs.url}>bug</a>
                    </p>
                </div>
            </footer>
        )
    }
}

export default Footer
