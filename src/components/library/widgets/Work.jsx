import classNames from 'classnames'
import PropTypes from 'prop-types'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { workPropType } from 'serverPropTypes/library'

export default function WorkWidget({
  work,
  query,
  noIcon,
  noCount,
  truncatable,
}) {
  /**
   * Work icon
   */

  let icon
  if (!noIcon && work.work_type) {
    icon = (
      <span className="icon">
        <i className={`las la-${work.work_type.icon_name}`}></i>
      </span>
    )
  }

  /**
   * Song count
   */

  let count
  if (!noCount) {
    count = (
      <span className="count">
        <span className="icon">
          <i className="las la-music"></i>
        </span>
        <span className="value">{work.song_count}</span>
      </span>
    )
  }

  /**
   * Subtitle
   */

  let subtitle
  if (work.subtitle) {
    subtitle = <span className="subtitle">{work.subtitle}</span>
  }

  return (
    <div className={classNames('work-widget', { truncatable })}>
      {icon}
      <HighlighterQuery
        query={query}
        className="title"
        searchWords={(q) => {
          let searchWords = q.work.contains.concat(q.remaining)
          const workTypeQuery = q.work_type[work.work_type.query_name]
          if (workTypeQuery) {
            // Add keyword for specific worktype if it exists
            searchWords = searchWords.concat(workTypeQuery.contains)
          }

          return searchWords
        }}
        textToHighlight={work.title}
      />
      {subtitle}
      {count}
    </div>
  )
}

WorkWidget.propTypes = {
  work: workPropType.isRequired,
  query: PropTypes.object,
  noIcon: PropTypes.bool,
  noCount: PropTypes.bool,
  truncatable: PropTypes.bool,
}
