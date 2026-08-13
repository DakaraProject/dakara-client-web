import classNames from 'classnames'
import PropTypes from 'prop-types'

import WorkWidget from 'components/library/widgets/Work'
import { WorkLinkName } from 'reducers/library'
import { workLinkPropType } from 'serverPropTypes/library'

export default function WorkLinkWidget({
  workLink,
  query,
  longLinkType,
  noEpisodes,
  truncatable,
  workProps,
}) {
  /**
   * Link
   */

  const linkType = (
    <span className="link-type">
      {longLinkType ? WorkLinkName[workLink.link_type] : workLink.link_type}
    </span>
  )

  let linkNumber
  if (workLink.link_type_number) {
    linkNumber = (
      <span className="link-number">{workLink.link_type_number}</span>
    )
  }

  const link = (
    <span className="link">
      {linkType}
      {linkNumber}
    </span>
  )

  /**
   * Episodes
   */

  let episodes
  if (!noEpisodes && workLink.episodes) {
    episodes = <span className="episodes">Episode {workLink.episodes}</span>
  }

  return (
    <div className={classNames('work-link-widget', { truncatable })}>
      <WorkWidget work={workLink.work} query={query} {...workProps} noCount />
      {link}
      {episodes}
    </div>
  )
}

WorkLinkWidget.propTypes = {
  workLink: workLinkPropType.isRequired,
  query: PropTypes.object,
  longLinkType: PropTypes.bool,
  noEpisodes: PropTypes.bool,
  truncatable: PropTypes.bool,
  workProps: PropTypes.object,
}
