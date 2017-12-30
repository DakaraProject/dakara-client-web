import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'

export default class WorkDisplay extends Component {
    /**
     * Work title
     * @param query text used for query, found in `this.props.query`
     */
    getTitle = (query) => {
        const workLink = this.props.work
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

        return title
    }

    /**
     * Subtitle if any
     */
    getSubtitle = () => {
        const workLink = this.props.work
        let subtitle
        if (workLink.work.subtitle) {
            subtitle = (<span className="subtitle">
                {workLink.work.subtitle}
                </span>)
        }

        return subtitle
    }

    /**
     * Link between song and work infos
     * with number if any
     * @param linkNameString work link name to display, as in
     * `this.props.work.link_type` or `this.props.work.link_type_name`
     */
    getLink = (linkNameString) => {
        const workLink = this.props.work

        const linkName = (<span className="link-type">{linkNameString}</span>)

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

        return link
    }

    render() {
        return (
                <div className="work-display">
                    {this.getTitle()}
                    {this.getSubtitle()}
                    {this.getLink(this.props.work.link_type)}
                </div>
            )
    }
}
