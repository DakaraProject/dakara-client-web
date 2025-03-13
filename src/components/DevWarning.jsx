import { Component } from 'react'
import version from 'version'

export default class DevWarning extends Component {
  render() {
    if (version.prerelease.length > 0) {
      console.warn('You are running a dev version, use it at your own risks!')
      return <div id="dev-warning"></div>
    }

    return null
  }
}
