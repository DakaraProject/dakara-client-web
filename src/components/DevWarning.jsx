import React, { Component } from 'react'
import semver from 'semver'

export default class DevWarning extends Component {
    componentDidMount() {
        console.log('You are running a dev version, use it at your own risks!')
    }

    render() {
        const version = semver.parse(process.env.DAKARA_VERSION)

        if (version.prerelease.length > 0) {
            return (
                <div id="dev-warning"></div>
            )
        }

        return null
    }
}
