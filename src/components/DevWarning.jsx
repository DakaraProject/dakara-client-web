import { Component } from 'react'
import semver from 'semver'


export default class DevWarning extends Component {
    render() {
        const version = semver.parse(import.meta.env.DAKARA_VERSION)

        if (version.prerelease.length > 0) {
            console.warn('You are running a dev version, use it at your own risks!')
            return (
                <div id="dev-warning"></div>
            )
        }

        return null
    }
}
