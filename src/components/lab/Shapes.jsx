import classNames from 'classnames'
import { useState } from 'react'

import { SelectField } from 'components/generics/Form'
import { Checkmark, TriangleDown } from 'components/generics/Shapes'

const factors = Object.freeze([
  { value: 'x1', name: '× 1' },
  { value: 'x2', name: '× 2' },
  { value: 'x5', name: '× 5' },
  { value: 'x10', name: '× 10' },
])

export default function Shapes() {
  const [factor, setFactor] = useState('1')

  const shapes = [
    { name: 'Checkmark', shape: <Checkmark enabled /> },
    { name: 'Triangle down', shape: <TriangleDown /> },
  ]

  return (
    <div id="shapes" className="flow">
      <div className="listing-table-container free">
        <table className="listing">
          <thead>
            <tr className="listing-header">
              <th>Name</th>
              <th>Shape</th>
            </tr>
          </thead>
          <tbody>
            {shapes.map((shape) => (
              <tr className="listing-entry listable" key={shape}>
                <td className="name">{shape.name}</td>
                <td className={classNames('shape', factor)}>{shape.shape}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="controls">
        <div className="form inline space">
          <SelectField
            id="magnify"
            value={factor}
            options={factors}
            setValue={(id, factor) => setFactor(factor)}
            inline
          />
        </div>
      </div>
    </div>
  )
}
