import PropTypes from 'prop-types'
import React, { Component } from 'react'

import HighlighterQuery from 'components/generics/HighlighterQuery'
import { WorkLinkName } from 'reducers/library'
import { workLinkPropType } from 'serverPropTypes/library'

/**
 * Display work link
 * props:
 * - workLink: work link to display
 * - query: query to highlight search terms
 * - longLinkType: display link type in long form (OPENING instead of OP)
 * - noIcon: don'tdisplay work type icon
 * - noEpisodes: don't display episodes
 */
export default class WorkLink extends Component {
    static propTypes = {
        workLink: workLinkPropType.isRequired,
        query: PropTypes.object,
        longLinkType: PropTypes.bool,
        noIcon: PropTypes.bool,
        noEpisodes: PropTypes.bool,
    }

    render() {
        const { workLink, query, longLinkType, noIcon, noEpisodes } = this.props

        // Subtitle if any
        let subtitle
        if (workLink.work.subtitle) {
            subtitle = (<span className="subtitle">
                {workLink.work.subtitle}
                </span>)
        }


        // Link type
        const linkType = (
                <span className="link-type">
                    {
                        longLinkType ?
                            WorkLinkName[workLink.link_type] :
                            workLink.link_type
                    }
                </span>
        )

        // Link number if any
        let linkNb
        if (workLink.link_type_number) {
            linkNb = (<span className="link-nb">{workLink.link_type_number}</span>)
        }

        const link = (
            <span className="work-link-item">
                <span className="link">
                    {linkType}
                    {linkNb}
                </span>
            </span>
            )

        // Display work icon conditionally
        let icon
        if (!noIcon && workLink.work.work_type) {
            icon = (
                    <span className="work-link-item icon">
                        <i className={`fa fa-${workLink.work.work_type.icon_name}`}></i>
                    </span>
            )
        }

        // Display episoded if any, conditionally
        let episodes
        if (!noEpisodes && workLink.episodes) {
            episodes = (
                    <span className="work-link-item episodes">
                        Episode {workLink.episodes}
                    </span>
                    )
        }

        return (
                <div className="work-link">
                    <span className="title-group work-link-item">
                        <HighlighterQuery
                            query={query}
                            className="title"
                            searchWords={(q) => {
                                let searchWords = q.work.contains.concat(q.remaining)
                                const workTypeQuery = q.work_type[
                                    workLink.work.work_type.query_name
                                ]
                                if (workTypeQuery) {
                                    // Add keyword for specific worktype if it exists
                                    searchWords = searchWords.concat(
                                        workTypeQuery.contains
                                    )
                                }

                                return searchWords
                            }}
                            textToHighlight={workLink.work.title}
                        />
                        {subtitle}
                    </span>
                    {link}
                    {episodes}
                    {icon}
                </div>
            )
    }
}
