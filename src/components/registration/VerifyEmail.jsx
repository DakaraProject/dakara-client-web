import classNames from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

import { verifyEmail } from 'actions/users'
import {
  alterationResponsePropType,
  Status,
} from 'reducers/alterationsResponse'
import { withLocation } from 'thirdpartyExtensions/ReactRouterDom'

class VerifyEmail extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    responseOfVerifyEmail: alterationResponsePropType,
    verifyEmail: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const queryObj = queryString.parse(this.props.location.search)

    const { user_id, email, timestamp, signature } = queryObj

    // Send verify request to server
    this.props.verifyEmail(user_id, email, timestamp, signature)
  }

  render() {
    const { responseOfVerifyEmail } = this.props
    let content
    let className

    switch (responseOfVerifyEmail.status) {
      case Status.successful:
        content = (
          <div className="flow">
            <p>Email successfuly validated.</p>
          </div>
        )
        className = 'success'
        break

      case Status.failed: {
        let message
        if (responseOfVerifyEmail.message) {
          message = <p>Reason: {responseOfVerifyEmail.message}</p>
        }

        content = (
          <div className="flow">
            <p>Error validating email.</p>
            {message}
          </div>
        )
        className = 'danger'
        break
      }

      default:
        content = (
          <div className="flow">
            <p>Validating...</p>
          </div>
        )
        className = 'success'
    }

    return (
      <div id="verify-email" className={classNames('box', className)}>
        <div className="header">
          <h2>Email verification</h2>
        </div>
        {content}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  responseOfVerifyEmail: state.alterationsResponse.unique.verifyEmail || {},
})

VerifyEmail = withLocation(
  connect(mapStateToProps, {
    verifyEmail,
  })(VerifyEmail)
)

export default VerifyEmail
