import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

import { verifyRegistration } from 'actions/users'
import {
  alterationResponsePropType,
  Status,
} from 'reducers/alterationsResponse'
import { withLocation } from 'thirdpartyExtensions/ReactRouterDom'

class VerifyRegistration extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    responseOfVerifyRegistration: alterationResponsePropType,
    verifyRegistration: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const queryObj = queryString.parse(this.props.location.search)

    const { user_id, timestamp, signature } = queryObj

    // Send verify request to server
    this.props.verifyRegistration(user_id, timestamp, signature)
  }

  render() {
    const { responseOfVerifyRegistration } = this.props
    let content
    let error = false

    switch (responseOfVerifyRegistration.status) {
      case Status.successful:
        content = (
          <div className="content">
            <p>Email successfuly validated.</p>
            <p>
              A manager will validate your account, you&apos;ll be notified by
              email.
            </p>
          </div>
        )
        break

      case Status.failed: {
        let message
        if (responseOfVerifyRegistration.message) {
          message = <p>Reason: {responseOfVerifyRegistration.message}</p>
        }

        content = (
          <div className="content">
            <p>Error validating email.</p>
            {message}
          </div>
        )
        error = true
        break
      }

      default:
        content = (
          <div className="content">
            <p>Validating...</p>
          </div>
        )
    }

    return (
      <div
        id="verify-registration"
        className={classNames('box', { danger: error })}
      >
        <div className="header">
          <h2>Email verification</h2>
        </div>
        {content}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  responseOfVerifyRegistration:
    state.alterationsResponse.unique.verifyRegistration || {},
})

VerifyRegistration = withLocation(
  connect(mapStateToProps, {
    verifyRegistration,
  })(VerifyRegistration)
)

export default VerifyRegistration
