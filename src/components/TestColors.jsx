import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

function getColor(ref, colorName) {
  const str = window.getComputedStyle(ref.current)[colorName]
  const regex = /rgb\((\d+), (\d+), (\d+)\)/
  const [_, r, g, b] = str.match(regex)
  return [parseInt(r), parseInt(g), parseInt(b)]
}

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

const formatRgbIntToHsl = ([rInt, gInt, bInt]) => {
  const [h, s, l] = rgbToHsl(rInt / 255, gInt / 255, bInt / 255)
  return `${(360 + h) % 360}, ${s.toFixed(2)}, ${l.toFixed(2)}`
}

const formatRgbIntToHex = ([rInt, gInt, bInt]) => {
  const r = rInt.toString(16).padStart(2, '0')
  const g = gInt.toString(16).padStart(2, '0')
  const b = bInt.toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

const formatRgbIntToRgb = ([rInt, gInt, bInt]) => {
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

function MosaicTile({ color, format, refresher }) {
  // get the color of the div and convert it to HSL space
  const ref = useRef(null)
  const [text, setText] = useState('')
  useEffect(() => {
    setText(formatters[format](getColor(ref, 'background')))
  }, [format, refresher])
  return (
    <td className={classNames('tile', color)} ref={ref}>
      {text}
    </td>
  )
}

MosaicTile.propTypes = {
  color: PropTypes.string,
  format: PropTypes.string,
  refresher: PropTypes.number,
}

function MosaicRow({ lightness, colors, format, refresher }) {
  return (
    <tr className="listing-entry">
      <td className="title">{lightness}</td>
      {colors.map((color) => (
        <MosaicTile
          color={`${color}-${lightness}`}
          key={color}
          format={format}
          refresher={refresher}
        />
      ))}
    </tr>
  )
}

MosaicRow.propTypes = {
  lightness: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  format: PropTypes.string,
  refresher: PropTypes.number,
}

function Mosaic() {
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
                format={format}
                refresher={refresher}
              />
            ))}
          </tbody>
        </table>
      </div>
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
    </div>
  )
}

// see: https://stackoverflow.com/a/9733420
const RED = 0.2126
const GREEN = 0.7152
const BLUE = 0.0722

const GAMMA = 2.4

function luminance(r, g, b) {
  var a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA)
  })
  return a[0] * RED + a[1] * GREEN + a[2] * BLUE
}

function contrast(rgb1, rgb2) {
  var lum1 = luminance(...rgb1)
  var lum2 = luminance(...rgb2)
  var brightest = Math.max(lum1, lum2)
  var darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

function SamplerTile({ background, foreground, refresher }) {
  const ref = useRef(null)
  const [text, setText] = useState('')
  useEffect(() => {
    setText(
      contrast(getColor(ref, 'background'), getColor(ref, 'color')).toFixed(2)
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
    400: ['400', '402', '403', '410', '412', '413'],
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

export default function TestColors() {
  return (
    <div className="test-colors box">
      <div className="header">
        <h2>Test colors</h2>
      </div>
      <div className="content">
        <Mosaic />
        <Sampler />
      </div>
    </div>
  )
}
