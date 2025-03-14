import {
  CheckboxField,
  FormBlock,
  HueField,
  InputField,
  RadioField,
  SelectField,
} from 'components/generics/Form'

export default function TestFields() {
  return (
    <div className="test-fields box">
      <div className="header">
        <h2>Test fields</h2>
      </div>
      <div className="content">
        <FormBlock action={null} alterationName="">
          <CheckboxField
            defaultValue={false}
            id="checkbox-false"
            label="Checkbox false"
          />
          <CheckboxField
            defaultValue={true}
            id="checkbox-true"
            label="Checkbox true"
          />
          <CheckboxField
            disabled
            defaultValue={false}
            id="checkbox-disabled-false"
            label="Checkbox disabled false"
          />
          <CheckboxField
            disabled
            defaultValue={true}
            id="checkbox-disabled-true"
            label="Checkbox disabled true"
          />
          <CheckboxField
            toggle
            defaultValue={false}
            id="toggle-false"
            label="Toggle false"
          />
          <CheckboxField
            toggle
            defaultValue={true}
            id="toggle-true"
            label="Toggle true"
          />
          <CheckboxField
            toggle
            disabled
            defaultValue={false}
            id="toggle-disabled-false"
            label="Toggle disabled false"
          />
          <CheckboxField
            toggle
            disabled
            defaultValue={true}
            id="toggle-disabled-true"
            label="Toggle disabled true"
          />
          <HueField defaultValue="10" id="hue" label="Hue" />
          <HueField
            disabled
            defaultValue="10"
            id="hue-disabled"
            label="Hue disabled"
          />
          <InputField defaultValue="default" id="input" label="Input" />
          <InputField
            disabled
            defaultValue="default"
            id="input-disabled"
            label="Input disabled"
          />
          <RadioField
            options={[
              { value: 'value1', name: 'Value 1' },
              { value: 'value2', name: 'Value 2' },
            ]}
            defaultValue="value1"
            id="radio"
            label="Radio"
          />
          <RadioField
            disabled
            options={[
              { value: 'value1', name: 'Value 1' },
              { value: 'value2', name: 'Value 2' },
            ]}
            defaultValue="value1"
            id="radio-disabled"
            label="Radio disabled"
          />
          <SelectField
            options={[
              { value: 'value1', name: 'Value 1' },
              { value: 'value2', name: 'Value 2' },
            ]}
            defaultValue="value1"
            id="select"
            label="Select"
          />
          <SelectField
            disabled
            options={[
              { value: 'value1', name: 'Value 1' },
              { value: 'value2', name: 'Value 2' },
            ]}
            defaultValue="value1"
            id="select-disabled"
            label="Select disabled"
          />
        </FormBlock>
      </div>
    </div>
  )
}
