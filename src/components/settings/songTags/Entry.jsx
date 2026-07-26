import classNames from 'classnames'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearAlteration } from 'actions/alterations'
import { editSongTag } from 'actions/songTags'
import { CheckboxField, FormInline, HueField } from 'components/generics/Form'
import HighlighterQuery from 'components/generics/HighlighterQuery'
import NotificationBar, {
  NotifiableForTable,
} from 'components/generics/NotificationBar'
import { Checkmark } from 'components/generics/Shapes'
import Slide from 'components/transitions/Slide'
import { Status } from 'reducers/alterationsResponse'
import { songTagPropType } from 'serverPropTypes/library'

export default function SongTagsEntry({ tag, editable }) {
  const query = useSelector((state) => state.settings.songTags.data.query)
  const responseOfEdit = useSelector(
    (state) => state.alterationsResponse.multiple.editSongTag?.[tag.id]
  )
  const responseOfEditColor = useSelector(
    (state) => state.alterationsResponse.multiple.editSongTagColor?.[tag.id]
  )

  const [colorFormDisplayed, setColorFormDisplayed] = useState(false)

  const dispatch = useDispatch()

  useEffect(
    () => () => {
      // clear alteration when component unmounts
      dispatch(clearAlteration('editSongTag', tag.id))
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    []
  )

  const displayColorForm = useCallback(() => {
    setColorFormDisplayed(true)
  }, [])

  const clearColorForm = useCallback(() => {
    setColorFormDisplayed(false)
  }, [])

  // enableness status
  const disabled = responseOfEdit && responseOfEdit.status === Status.pending

  const setValue = useCallback(
    (id, value) => {
      if (!disabled) {
        dispatch(editSongTag(tag.id, !value))
      }
    },
    // eslint-disable-next-line @eslint-react/exhaustive-deps
    [disabled]
  )

  // TODO It would be nice to set the checkbox to disabled if
  // the request (fetching) takes too much time.

  let enablenessWidget
  if (editable) {
    enablenessWidget = (
      <div className="form inline">
        <CheckboxField
          id={`enabled-state${tag.id}`}
          value={!tag.disabled}
          setValue={setValue}
          inline
          toggle
        />
      </div>
    )
  } else {
    enablenessWidget = <Checkmark enabled={!tag.disabled} />
  }

  // color
  let colorWidget
  if (editable) {
    colorWidget = (
      <div className="controls">
        <button
          className="control square display-color"
          onClick={displayColorForm}
          style={{ filter: `hue-rotate(${tag.color_hue}deg)` }}
        >
          <span className="icon">
            <i className="las la-paint-brush"></i>
          </span>
        </button>
      </div>
    )
  } else {
    colorWidget = (
      <div className="display-color-container">
        <div
          className="display-color"
          style={{ filter: `hue-rotate(${tag.color_hue}deg)` }}
        />
      </div>
    )
  }

  /**
   * Form to change color
   */

  const submitText = (
    <span className="icon">
      <i className="las la-check"></i>
    </span>
  )

  const cancelButton = (
    <button onClick={clearColorForm} className="control square danger">
      <span className="icon">
        <i className="las la-times"></i>
      </span>
    </button>
  )

  const colorForm = (
    <div className="notified color-form-notified transition">
      <FormInline
        action={`library/song-tags/${tag.id}/`}
        method="PATCH"
        submitText={submitText}
        submitClass="square success"
        alterationName="editSongTagColor"
        elementId={tag.id}
        noClearOnSuccess
        onSuccess={clearColorForm}
        extraControls={[cancelButton]}
      >
        <HueField id="color_hue" defaultValue={tag.color_hue} />
      </FormInline>
    </div>
  )

  return (
    <tr className="listing-entry listable hoverizable">
      <td className="notification-col color">
        <NotifiableForTable>
          <NotificationBar
            alterationResponse={responseOfEdit}
            failedMessage="Error attempting to edit tag"
            pendingMessage={false}
            successfulMessage={false}
          />
          <NotificationBar
            alterationResponse={responseOfEditColor}
            successfulMessage={false}
            pendingMessage={false}
            failedMessage="Error attempting to edit tag color"
          />
          <Slide in={colorFormDisplayed}>{colorForm}</Slide>
        </NotifiableForTable>
      </td>
      <td className="name">
        <HighlighterQuery
          query={query}
          searchWords={(q) => q.remaining}
          textToHighlight={tag.name}
        />
      </td>
      <td className={classNames('enableness', { 'controls-col': editable })}>
        {enablenessWidget}
      </td>
      <td className="controls-col">{colorWidget}</td>
    </tr>
  )
}

SongTagsEntry.propTypes = {
  tag: songTagPropType.isRequired,
  editable: PropTypes.bool,
}
