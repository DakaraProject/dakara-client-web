import React, { Component } from 'react'
import semver from 'semver'

export default class DevWarning extends Component {
    render() {
        const version = semver.parse(process.env.DAKARA_VERSION)

        if (version.prerelease.length > 0) {
            return (
                <div id="dev-warning">
                    You are running a dev version, use it at your own risks!
                </div>
            )
        }

        return null
    }
}
