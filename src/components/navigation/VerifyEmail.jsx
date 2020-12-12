import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import { verifyEmail } from 'actions/users'
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
            timestamp,
            signature
        } = queryObj

        // Send verify request to server
        this.props.verifyEmail(
            user_id,
            timestamp,
            signature
        )
    }

    render() {
        let message
        let error = false

        switch (this.props.responseOfVerifyEmail.status) {
            case Status.successful:
                message = (
                    <div className="message">
                        <p>Email successfuly validated.</p>
                        <p>A manager will validate your account, you'll be notified by email.</p>
                    </div>
                )
                break

            case Status.failed:
                message = (
                    <div className="message">
                        <p>Error validating email</p>
                        <p>{this.props.responseOfVerifyEmail.message}</p>
                    </div>
                )
                error = true
                break

            default:
                message = (
                    <div className="message">
                        <p>Validating...</p>
                    </div>
                )
        }

        return (
            <div id="verify-email" className={classNames("box", {error})}>
                <div className="box-header">
                    <h2>Email verification</h2>
                </div>
                {message}
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    responseOfVerifyEmail: state.alterationsResponse.unique.verifyEmail || {},
})

VerifyEmail = connect(
    mapStateToProps,
    {
        verifyEmail
    }
)(VerifyEmail)
export default VerifyEmail
