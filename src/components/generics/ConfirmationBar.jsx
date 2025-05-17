import PropTypes from 'prop-types'
import { Component } from 'react'

export default class ConfirmationBar extends Component {
  static propTypes = {
    message: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  }

  static defaultProps = {
    message: 'Are you sure?',
  }

  render() {
    const { message, onConfirm, onCancel } = this.props

    return (
      <div className="notified">
        <div className="notification warning">
          <div className="message">{message}</div>
          <div className="controls compact">
            <button
              onClick={() => {
                onConfirm()
              }}
              className="control square success"
            >
              <span className="icon">
                <i className="las la-check"></i>
              </span>
            </button>
            <button
              onClick={() => {
                onCancel()
              }}
              className="control square danger"
            >
              <span className="icon">
                <i className="las la-times"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}
