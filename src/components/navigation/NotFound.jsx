import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Component } from 'react'

import { withLocation } from 'thirdpartyExtensions/ReactRouterDom'

class NotFound extends Component {
  static propTypes = {
    embedded: PropTypes.bool,
    location: PropTypes.object.isRequired,
  }

  render() {
    const url = this.props.location.pathname
    const { embedded } = this.props
    return (
      <div id="error-page" className={classNames('box danger', { embedded })}>
        <div className="header">
          <h2>Not found</h2>
        </div>
        <div className="content">
          <div className="url">{url}</div>
          <p>We&apos;re sorry, your request did not match any route…</p>
        </div>
      </div>
    )
  }
}

NotFound = withLocation(NotFound)

export default NotFound
