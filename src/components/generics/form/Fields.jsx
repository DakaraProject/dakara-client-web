import { InlineFormContext } from 'contexts'
import PropTypes from 'prop-types'
import { useContext } from 'react'

function Field({ children, ...rest }) {
  const inline = useContext(InlineFormContext)

  if (inline) {
    return <FieldInline {...rest}>{children}</FieldInline>
  }

  return <FieldBlock {...rest}>{children}</FieldBlock>
}

Field.propTypes = {
  children: PropTypes.node.isRequired,
}

function FieldInline({ children }) {
  return <div className="field">{children}</div>
}

FieldInline.propTypes = {
  children: PropTypes.node.isRequired,
}

function FieldBlock({ id, label, errors, children }) {
  let errorNotification
  const error = errors?.[id]
  if (error) {
    if (error.type === 'required') {
      errorNotification = <p>This field is requiered</p>
    } else {
      errorNotification = <p>{error.message}</p>
    }
  }

  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="input">
        {children}
        {errorNotification}
      </div>
    </div>
  )
}

FieldBlock.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  errors: PropTypes.object,
  children: PropTypes.node.isRequired,
}

export function InputField({ id, label, type, register, errors, validation }) {
  return (
    <Field id={id} label={label} errors={errors}>
      <div className="text-input">
        <input type={type} {...register(id, validation)} />
      </div>
    </Field>
  )
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  type: PropTypes.string,
  register: PropTypes.func,
  errors: PropTypes.object,
  validation: PropTypes.object,
}

// export function SelectField({
//   id,
//   label,
//   options,
//   multiple,
//   registrer,
//   errors,
//   validation,
// }) {
//   return (
//     <Field id={id} label={label} errors={errors}>
//       <div className="select-input">
//         <select multiple={multiple} {...registrer(label, validation)}>
//           {options.map((option, id) => (
//             <option key={id} value={option.value || ''}>
//               {option.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </Field>
//   )
// }
