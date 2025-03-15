import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

// see:
// https://blog.logrocket.com/how-to-manipulate-css-colors-with-javascript-fb547113a1b8/
const rgbToLightness = (r, g, b) =>
  (1 / 2) * (Math.max(r, g, b) + Math.min(r, g, b))

const rgbToSaturation = (r, g, b) => {
  const L = rgbToLightness(r, g, b)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  return L === 0 || L === 1 ? 0 : (max - min) / (1 - Math.abs(2 * L - 1))
}

const rgbToHue = (r, g, b) =>
  Math.round(
    (Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180) / Math.PI
  )

const rgbToHsl = (r, g, b) => {
  const lightness = rgbToLightness(r, g, b)
  const saturation = rgbToSaturation(r, g, b)
  const hue = rgbToHue(r, g, b)
  return [hue, saturation, lightness]
}

const formatRgbIntToHsl = (rInt, gInt, bInt) => {
  const [h, s, l] = rgbToHsl(rInt / 255, gInt / 255, bInt / 255)
  return `${(360 + h) % 360}, ${s.toFixed(2)}, ${l.toFixed(2)}`
}

const formatRgbIntToHex = (rInt, gInt, bInt) => {
  const r = rInt.toString(16).padStart(2, '0')
  const g = gInt.toString(16).padStart(2, '0')
  const b = bInt.toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

const formatRgbIntToRgb = (rInt, gInt, bInt) => {
  const r = rInt / 255
  const g = gInt / 255
  const b = bInt / 255
  return `${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}`
}

const formatters = {
  rgb: formatRgbIntToRgb,
  hex: formatRgbIntToHex,
  hsl: formatRgbIntToHsl,
}

function Tile({ color, format, refresher }) {
  // get the color of the div and convert it to HSL space
  const ref = useRef(null)
  const [background, setBackground] = useState('')
  useEffect(() => {
    const bgStr = window.getComputedStyle(ref.current)['background']
    const regex = /rgb\((\d+), (\d+), (\d+)\)/
    const [_, rStr, gStr, bStr] = bgStr.match(regex)
    setBackground(
      formatters[format](parseInt(rStr), parseInt(gStr), parseInt(bStr))
    )
  }, [format, refresher])
  return (
    <td className={classNames('tile', color)} ref={ref}>
      {background}
    </td>
  )
}

Tile.propTypes = {
  color: PropTypes.string,
  format: PropTypes.string,
  refresher: PropTypes.number,
}

function Row({ name, colors, format, refresher }) {
  return (
    <tr className="listing-entry">
      <td className="tile title">{name}</td>
      {colors.map((color) => (
        <Tile color={color} key={color} format={format} refresher={refresher} />
      ))}
    </tr>
  )
}

Row.propTypes = {
  name: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  format: PropTypes.string,
  refresher: PropTypes.number,
}

export default function TestColors() {
  // add a manual refresher for the HSL values displayed in the tiles that
  // won't refresh themselves when the CSS is updated
  const [refresher, setRefresher] = useState(0)

  const forceRefresh = () => {
    setRefresher((refresher) => refresher + 1)
  }

  const [format, setFormat] = useState('hsl')

  const createSetFormat = (fmt) => () => {
    setFormat(fmt)
  }

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
  ]

  const controls = (
    <div className="controls">
      <button className="control primary" onClick={createSetFormat('hex')}>
        Show HEX
      </button>
      <button className="control primary" onClick={createSetFormat('rgb')}>
        Show RGB
      </button>
      <button className="control primary" onClick={createSetFormat('hsl')}>
        Show HSL
      </button>
      <button className="control primary" onClick={forceRefresh}>
        Refresh
      </button>
    </div>
  )

  return (
    <div className="test-colors box">
      <div className="header">
        <h2>Test colors</h2>
      </div>
      <div className="content">
        <h3>Colors</h3>
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
              <Row
                key={lightness}
                name={lightness}
                colors={colors.map((color) => `${color}-${lightness}`)}
                format={format}
                refresher={refresher}
              />
            ))}
          </tbody>
        </table>
        {controls}
      </div>
    </div>
  )
}
