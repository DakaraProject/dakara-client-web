import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import {
  clearAlteration,
  setAlterationValidationErrors,
  submitAlteration,
} from 'actions/alterations'
import Notification from 'components/generics/Notification'
import {
  alterationResponsePropType,
  Status,
} from 'reducers/alterationsResponse'

class Form extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    alterationName: PropTypes.string.isRequired,
    alterationResponse: alterationResponsePropType,
    clearAlteration: PropTypes.func.isRequired,
    elementId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    formatValues: PropTypes.func,
    method: PropTypes.string,
    noClearOnSuccess: PropTypes.bool,
    onSuccess: PropTypes.func,
    setAlterationValidationErrors: PropTypes.func.isRequired,
    submitAlteration: PropTypes.func.isRequired,
    submitClass: PropTypes.string,
    submitText: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    title: PropTypes.string,
    validate: PropTypes.func,
    children: PropTypes.node,
    extraControls: PropTypes.arrayOf(PropTypes.element),
  }

  static defaultProps = {
    method: 'POST',
    submitClass: 'primary',
    submitText: 'Submit',
  }

  state = {
    formValues: {},
  }

  setDefaultFormValues = () => {
    const { formValues } = this.state
    const newFormValues = {}

    React.Children.forEach(this.props.children, (field) => {
      if (!field) return
      // only undefined values are replaced to the default value of the
      // component
      // this avoids corrupting falsy values such as false or 0
      if (
        field.props.defaultValue === undefined ||
        field.props.defaultValue == null
      ) {
        newFormValues[field.props.id] = field.type.getEmptyValue()
      } else {
        newFormValues[field.props.id] = field.props.defaultValue
      }
    })

    this.setState({
      formValues: {
        ...formValues,
        ...newFormValues,
      },
    })
  }

  componentDidMount() {
    this.setDefaultFormValues()
  }

  componentWillUnmount() {
    // Clear form messages
    const { alterationName, elementId } = this.props
    this.props.clearAlteration(alterationName, elementId)
  }

  componentDidUpdate(prevProps) {
    const { alterationResponse, noClearOnSuccess, onSuccess } = this.props
    const prevAlterationResponse = prevProps.alterationResponse

    // If there is a success notification
    if (alterationResponse && alterationResponse.status === Status.successful) {
      // and there was no response, or a different notification before
      if (
        !prevAlterationResponse ||
        alterationResponse.status !== prevAlterationResponse.status
      ) {
        if (!noClearOnSuccess) this.setDefaultFormValues()
        if (onSuccess) onSuccess()
      }
    }
  }

  setFieldValue = (fieldId, value) => {
    const { formValues } = this.state
    this.setState({
      formValues: {
        ...formValues,
        [fieldId]: value,
      },
    })
  }

  /**
   * Method called before submit, to validate fields
   * @return boolean indicating validation success
   */
  validate = () => {
    const {
      setAlterationValidationErrors,
      alterationName,
      elementId,
      validate,
    } = this.props
    const { formValues } = this.state

    // Global validation
    let globalErrors
    if (validate) {
      globalErrors = validate(formValues)
    }

    if (!globalErrors || globalErrors.length === 0) {
      globalErrors = null
    }

    // Check fields validations
    let fieldsErrors = {}
    React.Children.forEach(this.props.children, (field) => {
      if (!field) return
      const { id, required, validate, disabled, disabledBy } = field.props
      const value = formValues[id]

      // Don't validate when field is disabled, or disabled by other field
      if (disabled || (disabledBy && !formValues[disabledBy])) {
        return
      }

      // process each check for this field
      // for each failure, add error message to table
      let errors = []
      if (!value && required) {
        errors.push('This field is required.')
      }

      if (validate) {
        // The field has a custom validate method
        const validateResult = validate(value, formValues)
        if (validateResult) {
          errors = errors.concat(validateResult)
        }
      }

      if (errors.length !== 0) {
        fieldsErrors[id] = errors
      }
    })

    if (Object.keys(fieldsErrors).length !== 0 || globalErrors) {
      // Validation errors
      // Dispatch action to set errors
      setAlterationValidationErrors(
        alterationName,
        elementId,
        globalErrors,
        fieldsErrors
      )
      return false
    }

    return true
  }

  /**
   * Method called when form is submited and validatio has passed
   */
  submit = () => {
    const {
      alterationName,
      elementId,
      action,
      method,
      submitAlteration,
      children,
      formatValues,
    } = this.props

    const { formValues } = this.state

    // generate the data to send
    let json = {}

    React.Children.forEach(children, (field) => {
      if (!field) return
      const { ignore, ignoreIfEmpty, id } = field.props
      const value = formValues[id]

      // if the field has to be ignored
      if (ignore) return
      if (ignoreIfEmpty && value === field.type.getEmptyValue()) return

      // add data
      json[id] = value
    })

    // Use provided custom method to alter values sent to server
    if (formatValues) {
      json = formatValues(json)
    }

    submitAlteration(alterationName, elementId, action, method, json)
  }

  /**
   * Add form props to children fields and put them in a set
   * @param inline the field is rendered in inline mode.
   * @returns set of fields with props.
   */
  renderFieldsSet = (inline) => {
    const { children, alterationResponse } = this.props
    const { formValues } = this.state

    const fields = React.Children.map(children, (field) => {
      if (!field) return field
      const { id, disabledBy, disabled } = field.props
      let fieldErrors
      if (alterationResponse) {
        fieldErrors = alterationResponse.fields[id]
      }

      // When the field has a disableBy property
      // and the specified field has a falsy value
      // this field is disabled
      let disabledOverride = disabled
      if (!disabled && disabledBy && !formValues[disabledBy]) {
        disabledOverride = true
      }

      return React.cloneElement(field, {
        fieldErrors,
        setValue: this.setFieldValue,
        value: formValues[id],
        inline,
        disabled: disabledOverride,
      })
    })

    return <div className="set">{fields}</div>
  }

  renderSubmit = () => {
    const { submitText, submitClass } = this.props
    const controlClass = classNames('control', submitClass)

    return (
      <button type="submit" className={controlClass}>
        {submitText}
      </button>
    )
  }

  renderExtraControls = () => {
    const { extraControls } = this.props

    return React.Children.map(extraControls, (control) =>
      React.cloneElement(control, { key: control })
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { alterationName, elementId } = ownProps

  // form attached to an alteration of type multiper
  if (typeof elementId !== 'undefined') {
    return {
      alterationResponse:
        state.alterationsResponse.multiple[alterationName]?.[elementId],
    }
  }

  // form attached to an alteration of type unique
  return {
    alterationResponse: state.alterationsResponse.unique[alterationName],
  }
}

/**
 * FormBlock component
 * For creating forms
 *
 * Required properties:
 * - title <str>: Name to display in the form header.
 * - alterationName <str>: Unique form identifier.
 * - action <str>: url to submit form to, relative to base url
 *
 * Optional properties:
 * - method <str>: Method used to submit form, default to 'POST'
 * - submitText <str or element>: Submit button text, default: "Submit"
 * - submitClass <str>: Submit button class, default: `primary`
 * - extraControls <list of elements>: Extra controls appended to the right of
 *                                     the submit control.
 * - successMessage <str>: Message to display when form submit suceed,
 *                           if false, no messsage is displayed.
 * - pendingMessage <str>: Message to display when submit request is pending
 *                           if false, no messsage is displayed.
 * - validate <func>: Called on submit, with object containing form values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - formatValues <func>: Called before sending request to server,
 *                      with object containing form values.
 *                      Allows to alter form data before sending.
 *                      Should return a dict that will be sent to server.
 * - noClearOnSuccess <bool>: By default the form values are cleared when
 *                              request succeed.
 *                              If this value is true, forms are not cleared.
 * - onSuccess <func>: Called on form action success. Does not have access to
 *                      arguments.
 *
 *
 *
 */
class FormBlock extends Form {
  render() {
    const { title, alterationResponse, successMessage, pendingMessage } =
      this.props

    // get title if defined
    let header
    if (title) {
      header = (
        <div className="header">
          <h3>{title}</h3>
        </div>
      )
    }

    // get fields
    const fieldsSet = this.renderFieldsSet()

    // get submit
    const submit = this.renderSubmit()

    // get extra controls
    const extraControls = this.renderExtraControls()

    // get failed message if unconsistent case
    let failedMessage
    if (
      alterationResponse &&
      Object.keys(alterationResponse.fields).length === 0
    ) {
      failedMessage = 'Unknown error!'
    } else {
      failedMessage = null
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (this.validate()) {
            this.submit()
          }
        }}
        className="form block"
        noValidate
      >
        {header}
        {fieldsSet}
        <div className="controls notifiable">
          <Notification
            alterationResponse={alterationResponse}
            successfulMessage={successMessage}
            failedMessage={failedMessage}
            pendingMessage={pendingMessage}
          />
          {submit}
          {extraControls}
        </div>
      </form>
    )
  }
}

FormBlock = connect(mapStateToProps, {
  setAlterationValidationErrors,
  submitAlteration,
  clearAlteration,
})(FormBlock)

export { FormBlock }

/**
 * FormInline component
 * For creating inline forms
 *
 * Required properties:
 * - title <str>: Name to display in the form header.
 * - alterationName <str>: Unique form identifier.
 * - action <str>: url to submit form to, relative to base url
 *
 * Optional properties:
 * - method <str>: Method used to submit form, default to 'POST'
 * - submitText <str or element>: Submit button text, default: "Submit"
 * - submitClass <str>: Submit button class, default: `primary`
 * - extraControls <list of elements>: Extra controls appended to the right of
 *                                     the submit control.
 * - successMessage <str>: Message to display when form submit suceed,
 *                           if null, no messsage is displayed.
 * - validate <func>: Called on submit, with object containing form values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - formatValues <func>: Called before sending request to server,
 *                      with object containing form values.
 *                      Allows to alter form data before sending.
 *                      Should return a dict that will be sent to server.
 * - noClearOnSuccess <bool>: By default the form values are cleared when
 *                              request succeed.
 *                              If this value is true, forms are not cleared.
 * - onSuccess <func>: Called on form action success. Does not have access to
 *                      arguments.
 *
 *
 *
 */
class FormInline extends Form {
  render() {
    // get fields
    const fieldsSet = this.renderFieldsSet(true)

    // get submit
    const submit = this.renderSubmit()

    // get extra controls
    const extraControls = this.renderExtraControls()

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (this.validate()) {
            this.submit()
          }
        }}
        className="form inline"
        noValidate
      >
        {fieldsSet}
        <div className="controls">
          {submit}
          {extraControls}
        </div>
      </form>
    )
  }
}

FormInline = connect(mapStateToProps, {
  setAlterationValidationErrors,
  submitAlteration,
  clearAlteration,
})(FormInline)

export { FormInline }

/**
 * Form Field abstract component
 * Specializations of this component should be used as a direct child of a Form
 *
 * Each specialization must take care of a null value by itself and convert it
 * to its most logical type or React required type.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 *
 * Optional properties:
 * - label <str/jsx>: Label of the field.
 * - defaultValue <any>: Pre-fill field with given value.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - disabledBy <str>: Id of another field controlling disabled status of this
 *                     field. When this other field value is falsy, this field
 *                     will be disabled.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the field tag.
 */
class Field extends Component {
  static propTypes = {
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    disabledBy: PropTypes.string,
    fieldErrors: PropTypes.array,
    id: PropTypes.string.isRequired,
    ignore: PropTypes.bool,
    ignoreIfEmpty: PropTypes.bool,
    inline: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    required: PropTypes.bool,
    setValue: PropTypes.func,
    validate: PropTypes.func,
    value: PropTypes.any,
  }

  static getEmptyValue() {
    return ''
  }

  subRender = (args) => null

  render() {
    const {
      id,
      label,
      setValue,
      value,
      fieldErrors,
      defaultValue,
      validate,
      disabled,
      ignore,
      ignoreIfEmpty,
      inline,
      disabledBy,
      ...remaining
    } = this.props

    // field error
    let fieldErrorMessages
    if (fieldErrors && !inline) {
      const fieldErrorContent = fieldErrors.map((fieldError, id) => (
        <div className="notification danger error" key={id}>
          {fieldError}
        </div>
      ))

      fieldErrorMessages = (
        <CSSTransition
          classNames="error-container"
          timeout={{
            enter: 300,
            exit: 150,
          }}
        >
          <div className="error-container">{fieldErrorContent}</div>
        </CSSTransition>
      )
    }

    // props to pass to the field tag
    let propsValue = value

    if (propsValue === undefined) {
      propsValue = this.constructor.getEmptyValue()
    }

    const props = {
      id,
      value: propsValue,
      onChange: (e) => {
        setValue(id, e.target.value)
      },
      disabled,
      ...remaining,
    }

    // class
    const renderClass = classNames('field', { disabled })

    // Inline form: render input field only
    if (inline) {
      return <div className={renderClass}>{this.subRender(props)}</div>
    }

    return (
      <div className={renderClass}>
        <label htmlFor={id} className="label">
          {label}
        </label>
        <div className="input">
          {this.subRender(props)}
          <TransitionGroup>{fieldErrorMessages}</TransitionGroup>
        </div>
      </div>
    )
  }
}

/**
 * Form Field component based on the Input tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to empty string.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 *
 * Optional properties:
 * - type <str>: Html input type, default to text field.
 * - label <str/jsx>: Label of the field.
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - disabledBy <str>: Id of another field controlling disabled status of this
 *                     field. When this other field value is falsy, this field
 *                     will be disabled.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class InputField extends Field {
  subRender = (args) => (
    <div className="text-input">
      <input {...args} />
    </div>
  )
}

/**
 * Form Field component based on the Select tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to empty string in the HTML tag. In the state, empty
 * strings are converted into null.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - options <Array>: List of the different options to display. Each list item
 *                      must be an object with a `value` key and a `name` key.
 *
 * Optional properties:
 * - label <str/jsx>: Label of the field.
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - disabledBy <str>: Id of another field controlling disabled status of this
 *                     field. When this other field value is falsy, this field
 *                     will be disabled.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the select tag.
 */
export class SelectField extends Field {
  static propTypes = {
    ...Field.propTypes,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.any, // TODO should be isRequired, but if the value
        // is null, an error is raised; this is a feature:
        // https://github.com/facebook/react/issues/3163
      }).isRequired
    ).isRequired,
    defaultValue: PropTypes.string,
  }

  static getEmptyValue() {
    return null
  }

  subRender = (args) => {
    const { options, multiple, value, ...remainingArgs } = args
    const { id, setValue } = this.props

    // remove props from remaining
    const { onChange, ...remaining } = remainingArgs

    // create options
    const content = options.map((option, id) => (
      <option key={id} value={option.value || ''}>
        {option.name}
      </option>
    ))

    // class
    // case for select of type multiple
    const subRenderClass = classNames('select-input', { multiple })

    return (
      <div className={subRenderClass}>
        <select
          multiple={multiple}
          value={value || ''}
          onChange={(e) => {
            setValue(id, e.target.value || null)
          }}
          {...remaining}
        >
          {content}
        </select>
      </div>
    )
  }
}

/**
 * Form Field component based on the input tag of type radio
 * Should be used as a direct child of a Form
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 * - options <Array>: List of the different options to display. Each list item
 *                      must be an object with a `value` key and a `name` key.
 *
 * Optional properties:
 * - long <bool>: If true, the `name` key in the items of `options` is supposed
 *                   to be long and cand spread on several lines.
 * - label <str/jsx>: Label of the field.
 * - defaultValue <str>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - disabledBy <str>: Id of another field controlling disabled status of this
 *                     field. When this other field value is falsy, this field
 *                     will be disabled.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class RadioField extends Field {
  static propTypes = {
    ...Field.propTypes,
    defaultValue: PropTypes.string,
    long: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
      }).isRequired
    ).isRequired,
  }

  static getEmptyValue() {
    return null
  }

  subRender = (args) => {
    const { options, value, long, ...remainingArgs } = args
    const { id, setValue } = this.props

    // remove onChange from remaining args
    const { onChange: onChangeArgs, id: idArgs, ...remaining } = remainingArgs

    // redefine onChange
    const onChange = (e) => {
      setValue(id, e.target.value || null)
    }

    // create options
    const inputs = options.map((option, itemId) => {
      const optionId = `${id}-${itemId}`

      return (
        <div key={optionId} className="radio-option">
          <input
            type="radio"
            name={id}
            value={option.value}
            id={optionId}
            onChange={onChange}
            checked={option.value === value}
            {...remaining}
          />
          <label htmlFor={optionId} className="fake marker"></label>
          <label
            htmlFor={optionId}
            className={classNames('description', { long })}
          >
            {option.name}
          </label>
        </div>
      )
    })

    return <div className="radio-input">{inputs}</div>
  }
}

/**
 * Form Field component based on the Input tag of type checkbox
 * Should be used as a direct child of a Form
 *
 * Null value is converted to false.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 *
 * Optional properties:
 * - toggle <bool>: If true, display as toggle instead of checkbox.
 * - label <str/jsx>: Label of the field.
 * - defaultValue <bool>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - disabledBy <str>: Id of another field controlling disabled status of this
 *                     field. When this other field value is falsy, this field
 *                     will be disabled.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class CheckboxField extends Field {
  static propTypes = {
    ...Field.propTypes,
    defaultValue: PropTypes.bool,
    toggle: PropTypes.bool,
    value: PropTypes.bool,
  }

  static getEmptyValue() {
    return false
  }

  subRender = (args) => {
    const { value, toggle, ...remainingArgs } = args
    const { id, setValue } = this.props

    // remove onChange from remaining args
    const { onChange, ...remaining } = remainingArgs

    const className = toggle ? 'toggle-input' : 'checkbox-input'

    return (
      <div className={className}>
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => {
            setValue(id, e.target.checked)
          }}
          {...remaining}
        />
        <label htmlFor={id} className="fake marker" id={`${id}-fake`}></label>
      </div>
    )
  }
}

/**
 * Form Field component based on the Input tag
 * Should be used as a direct child of a Form
 *
 * Null value is converted to 0 value.
 *
 * Required properties:
 * - id <str>: Unique field identifier.
 *
 * Optional properties:
 * - label <str/jsx>: Label of the field.
 * - defaultValue <number>: Pre-fill field with given value.
 * - inline <bool>: If true do not render label.
 * - validate <func>: Called on submit, with the following params:
 *                          - value of the field
 *                          - object containing all fields values.
 *                      When validation fails,
 *                      Should return an array of validation error message.
 *                      When validation succeed,
 *                      Should return a falsy value or empty array.
 * - disabledBy <str>: Id of another field controlling disabled status of this
 *                     field. When this other field value is falsy, this field
 *                     will be disabled.
 *
 * Validation modifiers:
 * - required <bool>: When true, field can not be empty.
 *
 * Filtering modifiers
 * - ignore <bool>: When true, the field is never passed to the server.
 * - ignoreIfEmpty <bool>: When true, the field is passed to the server only if
 *                          its value is not empty.
 *
 * Extra properties are passed to the input tag.
 */
export class HueField extends Field {
  static propTypes = {
    ...Field.propTypes,
    defaultValue: PropTypes.number,
    value: PropTypes.number,
  }

  static getEmptyValue() {
    return 0
  }

  subRender = (args) => {
    const { id, setValue, value } = this.props

    // remove onChange from args
    const { onChange, ...remaining } = args

    return (
      <div className="hue-input">
        <div className="preview" style={{ filter: `hue-rotate(${value}deg)` }}>
          {value}
        </div>
        <div className="input fake">
          <input
            className="faked"
            type="range"
            min="0"
            max="360"
            step="5"
            onChange={(e) => {
              setValue(id, parseInt(e.target.value))
            }}
            {...remaining}
          />
        </div>
      </div>
    )
  }
}
