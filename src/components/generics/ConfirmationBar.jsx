import PropTypes from 'prop-types'

export default function ConfirmationBar({
  message = 'Are you sure?',
  onCancel,
  onConfirm,
}) {
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

ConfirmationBar.propTypes = {
  message: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}
