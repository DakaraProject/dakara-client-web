import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'
import PropTypes from 'prop-types'
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

        // title with highlight
        let title
        if (query != undefined) {
            let searchWords = query.work.contains.concat(query.remaining)
            const workTypeQuery = query.work_type[workLink.work.work_type.query_name]
            if (workTypeQuery) {
                // Add keyword for specific worktype if exists
                searchWords = searchWords.concat(workTypeQuery.contains)
            }

            title = (
                    <Highlighter
                        className="work-link-item title"
                        searchWords={searchWords}
                        textToHighlight={workLink.work.title}
                        autoEscape
                    />
                )
        } else {
            title = (<span className="work-link-item title">{workLink.work.title}</span>)
        }

        // Subtitle if any
        let subtitle
        if (workLink.work.subtitle) {
            subtitle = (<span className="work-link-item subtitle">
                {workLink.work.subtitle}
                </span>)
        }


        // Link type
        const linkType = (
                <span className="link-type">
                    {longLinkType ? workLink.link_type_name : workLink.link_type}
                </span>
        )

        // Link number if any
        let linkNb
        if (workLink.link_type_number) {
            linkNb = (<span className="link-nb">{workLink.link_type_number}</span>)
        }

        const link = (
                <span className="work-link-item link">
                    {linkType}
                    {linkNb}
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
                    {title}
                    {subtitle}
                    {link}
                    {episodes}
                    {icon}
                </div>
            )
    }
}
