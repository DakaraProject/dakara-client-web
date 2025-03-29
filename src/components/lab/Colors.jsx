import classNames from 'classnames'
import convert from 'color-convert'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { contrastRatio } from 'wcag-contrast-utils'

import { SelectField } from 'components/generics/Form'

const colorRegex = /(\w+)\((\d+.?\d*),? (\d+.?\d*),? (\d+.?\d*)\)/

function getColor(ref, style) {
  const str = window.getComputedStyle(ref.current)[style]
  const match = str.match(colorRegex)
  if (!match) {
    console.warn('Unable to parse color', str)
    return ['rgb', [0.0, 0.0, 0.0]]
  }
  const [_, space, c1, c2, c3] = match
  return [space, [parseFloat(c1), parseFloat(c2), parseFloat(c3)]]
}

function formatColor(color, space) {
  switch (space) {
    case 'hex':
      return `#${color}`

    case 'keyword':
    case 'ansi16':
    case 'ansi256':
      return color

    default:
      return color.join(', ')
  }
}

function convertColor(color, fromSpace, toSpace) {
  return fromSpace === toSpace ? color : convert[fromSpace][toSpace](color)
}

function convertFormatColor(color, fromSpace, toSpace) {
  return formatColor(convertColor(color, fromSpace, toSpace), toSpace)
}

const spaces = Object.freeze(
  Object.keys(convert).map((space) => {
    return { value: space, name: space.toUpperCase() }
  })
)

function MosaicTile({ color, space, refresher }) {
  // get the color of the div and convert it to HSL space
  const ref = useRef(null)
  const [text, setText] = useState('')
  useEffect(() => {
    const [fromSpace, color] = getColor(ref, 'background')
    setText(convertFormatColor(color, fromSpace, space))
  }, [space, refresher])
  return (
    <td className={classNames('tile', color)} ref={ref}>
      {text}
    </td>
  )
}

MosaicTile.propTypes = {
  color: PropTypes.string,
  space: PropTypes.string,
  refresher: PropTypes.number,
}

function MosaicRow({ lightness, colors, space, refresher }) {
  return (
    <tr className="listing-entry">
      <td className="title">{lightness}</td>
      {colors.map((color) => (
        <MosaicTile
          color={`${color}-${lightness}`}
          key={color}
          space={space}
          refresher={refresher}
        />
      ))}
    </tr>
  )
}

MosaicRow.propTypes = {
  lightness: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  space: PropTypes.string,
  refresher: PropTypes.number,
}

function Mosaic() {
  // add a manual refresher for the values displayed in the tiles that won't
  // refresh themselves when the CSS is updated
  const [refresher, setRefresher] = useState(0)

  const [space, setSpace] = useState('lch')

  const colors = ['primary', 'neutral', 'success', 'warning', 'danger', 'info']

  const lightnesses = [
    '000',
    '100',
    '101',
    '102',
    '110',
    '111',
    '112',
    '120',
    '121',
    '122',
    '200',
    '201',
    '202',
    '300',
    '301',
    '302',
    '303',
    '400',
    '402',
    '403',
    '410',
    '412',
    '413',
    '420',
    '422',
    '423',
    '500',
    '502',
  ]

  return (
    <div className="section">
      <h3>Colors</h3>
      <div className="listing-table-container free">
        <table className="listing mosaic">
          <thead>
            <tr className="listing-header">
              <th>Lightness</th>
              <th>Primary</th>
              <th>Neutral</th>
              <th>Success</th>
              <th>Warning</th>
              <th>Danger</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {lightnesses.map((lightness) => (
              <MosaicRow
                key={lightness}
                lightness={lightness}
                colors={colors}
                space={space}
                refresher={refresher}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="controls">
        <div className="form inline space">
          <SelectField
            id="color-space"
            value={space}
            options={spaces}
            setValue={(id, space) => setSpace(space)}
            inline
          />
        </div>
        <button
          className="control primary"
          onClick={() => setRefresher((refresher) => refresher + 1)}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

function SamplerTile({ background, foreground, refresher }) {
  const ref = useRef(null)
  const [text, setText] = useState('')
  useEffect(() => {
    const [backgroundSpace, background] = getColor(ref, 'background')
    const [colorSpace, color] = getColor(ref, 'color')
    setText(
      contrastRatio(
        convertColor(background, backgroundSpace, 'rgb'),
        convertColor(color, colorSpace, 'rgb')
      ).toFixed(2)
    )
  }, [refresher])
  return (
    <td
      className={classNames('tile', background, `fg-${foreground}`)}
      ref={ref}
    >
      {text}
    </td>
  )
}

SamplerTile.propTypes = {
  background: PropTypes.string,
  foreground: PropTypes.string,
  refresher: PropTypes.number,
}

function SamplerRow({ background, foreground, colors, refresher }) {
  return (
    <tr className="listing-entry">
      <td className="title">{background}</td>
      <td className="title">{foreground}</td>
      {colors.map((color) => (
        <SamplerTile
          background={`${color}-${background}`}
          foreground={`${color}-${foreground}`}
          key={color}
          refresher={refresher}
        />
      ))}
    </tr>
  )
}

SamplerRow.propTypes = {
  background: PropTypes.string,
  foreground: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  refresher: PropTypes.number,
}

function Sampler() {
  const [refresher, setRefresher] = useState(0)

  const forceRefresh = () => {
    setRefresher((refresher) => refresher + 1)
  }

  const colors = ['primary', 'neutral', 'success', 'warning', 'danger', 'info']

  const lightnesses = {
    '000': ['000'],
    100: ['100', '101', '102', '110', '111', '112', '120', '121', '122'],
    200: ['200', '201', '202'],
    300: ['300', '301', '302', '303'],
    400: ['400', '402', '403', '410', '412', '413', '420', '422', '423'],
    500: ['500', '502'],
  }

  const createRows = (...arrays) =>
    arrays.reduce((aBg, aFg) =>
      aBg.flatMap((bg) =>
        aFg.map((fg) => (
          <SamplerRow
            key={`${bg}-${fg}`}
            background={bg}
            foreground={fg}
            colors={colors}
            refresher={refresher}
          />
        ))
      )
    )

  return (
    <div className="section">
      <h3>Contrasts</h3>
      <div className="listing-table-container free">
        <table className="listing sampler">
          <thead>
            <tr className="listing-header">
              <th>Background lightness</th>
              <th>Foreground lightness</th>
              <th>Primary</th>
              <th>Neutral</th>
              <th>Success</th>
              <th>Warning</th>
              <th>Danger</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {createRows(lightnesses['200'], lightnesses['000'])}
            {createRows(lightnesses['300'], lightnesses['000'])}
            {createRows(lightnesses['100'], lightnesses['400'])}
            {createRows(lightnesses['200'], lightnesses['500'])}
          </tbody>
        </table>
      </div>
      <div className="controls">
        <button className="control primary" onClick={forceRefresh}>
          Refresh
        </button>
      </div>
    </div>
  )
}

export default function Colors() {
  return (
    <div className="colors">
      <Mosaic />
      <Sampler />
    </div>
  )
}
