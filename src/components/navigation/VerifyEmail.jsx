import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
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
        if (this.props.responseOfVerifyEmail.status === Status.successful) {
            return (
                    <Redirect to="/login"/>
            )
        }

        if (this.props.responseOfVerifyEmail.status === Status.failed) {
            return (
                <p>Error validating email</p>
            )
        }

        // TODO display in a proper box
        return (
            <p>Validating...</p>
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
