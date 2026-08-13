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
          let words = q.remaining

          // add work query values if available
          if (q.work) {
            words = words.concat(q.work.contains)
          }

          // add work_type query values if available
          if (q.work_type) {
            const workTypeQuery = q.work_type[work.work_type.query_name]
            if (workTypeQuery) {
              // add keyword for specific worktype if it exists
              words = words.concat(workTypeQuery.contains)
            }
          }

          return words
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
