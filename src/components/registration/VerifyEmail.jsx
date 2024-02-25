import classNames from 'classnames'
import PropTypes from 'prop-types'
import { parse } from 'query-string'
import { Component } from 'react'
import { connect } from 'react-redux'

import { verifyEmail } from 'actions/users'
import { withLocation } from 'components/adapted/ReactRouterDom'
import { alterationResponsePropType, Status } from 'reducers/alterationsResponse'

class VerifyEmail extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        responseOfVerifyEmail: alterationResponsePropType,
        verifyEmail: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const queryObj = parse(this.props.location.search)

        const {
            user_id,
            email,
            timestamp,
            signature
        } = queryObj

        // Send verify request to server
        this.props.verifyEmail(
            user_id,
            email,
            timestamp,
            signature
        )
    }

    render() {
        const {
            responseOfVerifyEmail
        } = this.props
        let content
        let error = false

        switch (responseOfVerifyEmail.status) {
            case Status.successful:
                content = (
                    <div className="content">
                        <p>Email successfuly validated.</p>
                    </div>
                )
                break

            case Status.failed:
                let message
                if (responseOfVerifyEmail.message) {
                    message = (
                        <p>Reason: {responseOfVerifyEmail.message}</p>
                    )
                }

                content = (
                    <div className="content">
                        <p>Error validating email.</p>
                        {message}
                    </div>
                )
                error = true
                break

            default:
                content = (
                    <div className="content">
                        <p>Validating...</p>
                    </div>
                )
        }

        return (
            <div id="verify-email" className={classNames('box', {danger: error})}>
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

VerifyEmail = withLocation(connect(
    mapStateToProps,
    {
        verifyEmail
    }
)(VerifyEmail))

export default VerifyEmail
