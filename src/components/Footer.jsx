import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        const version = import.meta.env.DAKARA_VERSION
        const bugtracker = import.meta.env.DAKARA_BUGTRACKER
        const projectHomepage = import.meta.env.DAKARA_PROJECT_HOMEPAGE

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
                        Report a <a href={bugtracker}>bug</a>
                    </p>
                </div>
            </footer>
        )
    }
}
