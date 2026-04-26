import PropTypes from 'prop-types'

import Slide from 'components/transitions/Slide'

export default function ConfirmationBar({
  message = 'Are you sure?',
  show,
  setShow,
  onCancel,
  onConfirm,
  hideOnCancel = true,
  hideOnConfirm = false,
}) {
  return (
    <Slide in={show}>
      <div className="confirmation-bar notified transition">
        <div className="notification warning">
          <div className="message">{message}</div>
          <div className="controls compact">
            <button
              onClick={() => {
                if (hideOnConfirm) {
                  setShow(false)
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
                  setShow(false)
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
    </Slide>
  )
}

ConfirmationBar.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool,
  setShow: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  hideOnCancel: PropTypes.bool,
  hideOnConfirm: PropTypes.bool,
}
