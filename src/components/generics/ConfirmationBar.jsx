import PropTypes from 'prop-types'

export default function ConfirmationBar({
  message = 'Are you sure?',
  state,
  toggle,
  onCancel,
  onConfirm,
  hideOnCancel = true,
  hideOnConfirm = false,
}) {
  if (!state.isMounted) {
    return null
  }

  return (
    <div className={`confirmation-bar notified ${state.status}`}>
      <div className="notification warning">
        <div className="message">{message}</div>
        <div className="controls compact">
          <button
            onClick={() => {
              if (hideOnConfirm) {
                toggle(false)
              }
              if (typeof onConfirm === 'function') {
                onConfirm()
              }
            }}
            className="control square success"
          >
            <span className="icon">
              <i className="las la-check"></i>
            </span>
          </button>
          <button
            onClick={() => {
              if (hideOnCancel) {
                toggle(false)
              }
              if (typeof onCancel === 'function') {
                onCancel()
              }
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
  state: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  hideOnCancel: PropTypes.bool,
  hideOnConfirm: PropTypes.bool,
}
