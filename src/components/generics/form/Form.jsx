import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Form as FormOrigin } from 'react-hook-form'

export function Form({ inline, children, ...rest }) {
  if (inline) {
    // wrap by InlineFormContext
    return null
  }

  return <FormBlock {...rest}>{children}</FormBlock>
}

Form.propTypes = {
  inline: PropTypes.bool,
  children: PropTypes.node,
}

export function FormBlock({
  title,
  action,
  control,
  noSubmit,
  submitClass = 'primary',
  submitText = 'Submit',
  extraControls,
  children,
}) {
  return (
    <FormOrigin
      className="form block"
      action={action}
      control={control}
      headers={{ 'Content-Type': 'application/json' }}
    >
      {title && (
        <div className="header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="set">{children}</div>
      <div className="controls compact notifiable">
        {!noSubmit && (
          <button type="submit" className={classNames('control', submitClass)}>
            {submitText}
          </button>
        )}
        {extraControls}
      </div>
    </FormOrigin>
  )
}

FormBlock.propTypes = {
  title: PropTypes.string,
  action: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  noSubmit: PropTypes.bool,
  submitClass: PropTypes.string,
  submitText: PropTypes.string,
  extraControls: PropTypes.element,
  children: PropTypes.node,
}
