import PropTypes from 'prop-types'
import { Component } from 'react'

import Delayer from 'components/generics/Delayer'
import Notification from 'components/generics/Notification'
import { Status } from 'reducers/alterationsResponse'

export default class ListingFetchWrapper extends Component {
  static propTypes = {
    status: PropTypes.symbol,
    children: PropTypes.node,
  }

  render() {
    const { status } = this.props
    const alterationStatus = { status }

    let pending
    if (status === Status.pending) {
      pending = (
        <Delayer delay={200}>
          <div className="overlay">
            <div className="pending">Fetching...</div>
          </div>
        </Delayer>
      )
    }

    return (
      <div className="listing-fetch-wrapper notifiable">
        {this.props.children}

        <Notification
          alterationStatus={alterationStatus}
          pendingMessage={false}
          successfulMessage={false}
          failedMessage="Unable to get results"
          failedDuration={null}
        />
        {pending}
      </div>
    )
  }
}
