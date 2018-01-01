import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'

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
                        className="title"
                        searchWords={searchWords}
                        textToHighlight={workLink.work.title}
                        autoEscape
                    />
                )
        } else {
            title = (<span className="title">{workLink.work.title}</span>)
        }

        // Subtitle if any
        let subtitle
        if (workLink.work.subtitle) {
            subtitle = (<span className="subtitle">
                {workLink.work.subtitle}
                </span>)
        }


        // Link type
        const linkName = (
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
                <span className="link">
                    {linkName}
                    {linkNb}
                </span>
            )

        // Display work icon conditionally
        let icon
        if (!noIcon && workLink.work.work_type) {
            icon = (
                    <span className="type icon">
                        <i className={"fa fa-" + workLink.work.work_type.icon_name}></i>
                    </span>
            )
        }

        // Display episoded if any, conditionally
        let episodes
        if (!noEpisodes && workLink.episodes) {
            episodes = (
                    <span className="episodes">
                        Episode {workLink.episodes}
                    </span>
                    )
        }

        return (
                <div className="work-display">
                    {title}
                    {subtitle}
                    {link}
                    {episodes}
                    {icon}
                </div>
            )
    }
}
