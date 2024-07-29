import PropTypes from 'prop-types'
import { Component } from 'react'

import { withLocation } from 'components/adapted/ReactRouterDom'

class Forbidden extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
    }

    render() {
        const url = this.props.location.pathname
        return (
            <div id="error-page" className="box danger">
                <div className="header">
                    <h2>Forbidden</h2>
                </div>
                <div className="content">
                    <div className="url">{url}</div>
                    <p>We're sorry, you do not have the privilege to access {' '}
                    this ressource.</p>
                </div>
            </div>
       )
    }
}

export default withLocation(Forbidden)
