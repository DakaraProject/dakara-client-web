import classNames from 'classnames'
import PropTypes from 'prop-types'

import { songTagPropType } from 'serverPropTypes/library'

export default function SongTagList({ query, setQuery, tags, noClick }) {
  let searchIcon
  if (setQuery) {
    // Set clickable and add search icon
    searchIcon = (
      <span className="icon">
        <i className="las la-search"></i>
      </span>
    )
  }

  const tagList = tags.map((tag) => {
    const className = classNames('tag', {
      clickable: !!setQuery,
      disabled:
        // grey out tag when searching a tag other than this
        (query && query.tag.length && query.tag.indexOf(tag.name) === -1) ||
        // or when explicitely disabled
        tag.disabled,
    })

    if (noClick) {
      return (
        <div
          className={className}
          style={{ filter: `hue-rotate(${tag.color_hue}deg)` }}
          key={tag.name}
        >
          {searchIcon}
          {tag.name}
        </div>
      )
    }

    return (
      <button
        className={className}
        style={{ filter: `hue-rotate(${tag.color_hue}deg)` }}
        key={tag.name}
        onClick={() => setQuery && setQuery(`#${tag.name}`)}
      >
        {searchIcon}
        {tag.name}
      </button>
    )
  })

  return <div className="song-tag-list">{tagList}</div>
}

SongTagList.propTypes = {
  query: PropTypes.object,
  setQuery: PropTypes.func,
  tags: PropTypes.arrayOf(songTagPropType).isRequired,
  noClick: PropTypes.bool,
}
