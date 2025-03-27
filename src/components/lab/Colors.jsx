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
    const match = bgStr.match(regex)
    if (!match) return
    const [_, rStr, gStr, bStr] = match
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

export default function Colors() {
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

  const colorsBrand = [
    'brand-primary',
    'brand-success',
    'brand-warning',
    'brand-danger',
    'brand-info',
  ]

  const colorsBrandDarkish = [
    'brand-primary-darkish',
    'brand-success-darkish',
    'brand-warning-darkish',
    'brand-danger-darkish',
    'brand-info-darkish',
  ]

  const colorsBrandDarkened = [
    'brand-primary-darkened',
    'brand-success-darkened',
    'brand-warning-darkened',
    'brand-danger-darkened',
    'brand-info-darkened',
  ]

  const colorsBrandDark = [
    'brand-primary-dark',
    'brand-success-dark',
    'brand-warning-dark',
    'brand-danger-dark',
    'brand-info-dark',
  ]

  const colorsBrandDarker = [
    'brand-primary-darker',
    'brand-success-darker',
    'brand-warning-darker',
    'brand-danger-darker',
    'brand-info-darker',
  ]

  const colorsBrandLight = [
    'brand-primary-light',
    'brand-success-light',
    'brand-warning-light',
    'brand-danger-light',
    'brand-info-light',
  ]

  const colorsBrandLighter = [
    'brand-primary-lighter',
    'brand-success-lighter',
    'brand-warning-lighter',
    'brand-danger-lighter',
    'brand-info-lighter',
  ]

  const colorsNeutral = ['neutral-clear', 'neutral-soft', 'neutral-mid']

  const colorsNeutralDarkish = [
    'neutral-clear-darkish',
    'neutral-soft-darkish',
    'neutral-mid-darkish',
  ]

  const colorsNeutralDarkened = [
    'neutral-clear-darkened',
    'neutral-soft-darkened',
    'neutral-mid-darkened',
  ]

  const colorsNeutralDark = [
    'neutral-clear-dark',
    'neutral-soft-dark',
    'neutral-mid-dark',
  ]

  const colorsNeutralDarker = [
    'neutral-clear-darker',
    'neutral-soft-darker',
    'neutral-mid-darker',
  ]

  const colorsNeutralLight = [
    'neutral-clear-light',
    'neutral-soft-light',
    'neutral-mid-light',
  ]

  const colorsNeutralLighter = [
    'neutral-clear-lighter',
    'neutral-soft-lighter',
    'neutral-mid-lighter',
  ]

  const colorsTextDark = ['text-dark']

  const colorsTextLight = ['text-light']

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
    <div className="colors">
      <h3>Brand colors</h3>
      <table className="listing mosaic">
        <thead>
          <tr className="listing-header">
            <th>Variation</th>
            <th>Primary</th>
            <th>Success</th>
            <th>Warning</th>
            <th>Danger</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          <Row
            name="brand lighter"
            colors={colorsBrandLighter}
            format={format}
            refresher={refresher}
          />
          <Row
            name="brand light"
            colors={colorsBrandLight}
            format={format}
            refresher={refresher}
          />
          <Row
            name="brand"
            colors={colorsBrand}
            format={format}
            refresher={refresher}
          />
          <Row
            name="brand darkish"
            colors={colorsBrandDarkish}
            format={format}
            refresher={refresher}
          />
          <Row
            name="brand darkened"
            colors={colorsBrandDarkened}
            format={format}
            refresher={refresher}
          />
          <Row
            name="brand dark"
            colors={colorsBrandDark}
            format={format}
            refresher={refresher}
          />
          <Row
            name="brand darker"
            colors={colorsBrandDarker}
            format={format}
            refresher={refresher}
          />
        </tbody>
      </table>
      {controls}
      <h3>Neutral colors</h3>
      <table className="listing mosaic">
        <thead>
          <tr className="listing-header">
            <th>Variation</th>
            <th>Clear</th>
            <th>Soft</th>
            <th>Mid</th>
          </tr>
        </thead>
        <tbody>
          <Row
            name="neutral lighter"
            colors={colorsNeutralLighter}
            format={format}
            refresher={refresher}
          />
          <Row
            name="neutral light"
            colors={colorsNeutralLight}
            format={format}
            refresher={refresher}
          />
          <Row
            name="neutral"
            colors={colorsNeutral}
            format={format}
            refresher={refresher}
          />
          <Row
            name="neutral darkish"
            colors={colorsNeutralDarkish}
            format={format}
            refresher={refresher}
          />
          <Row
            name="neutral darkened"
            colors={colorsNeutralDarkened}
            format={format}
            refresher={refresher}
          />
          <Row
            name="neutral dark"
            colors={colorsNeutralDark}
            format={format}
            refresher={refresher}
          />
          <Row
            name="neutral darker"
            colors={colorsNeutralDarker}
            format={format}
            refresher={refresher}
          />
          <Row
            name="text light"
            colors={colorsTextLight}
            format={format}
            refresher={refresher}
          />
          <Row
            name="text dark"
            colors={colorsTextDark}
            format={format}
            refresher={refresher}
          />
        </tbody>
      </table>
      {controls}
    </div>
  )
}
