import React, { Component } from 'react'

export default class SongExpandedWorkEntry extends Component {
    handleSearchWork = () => {
        const work = this.props.work.work
        this.props.setQuery(work.work_type.query_name + ':""' + work.title + '""')
    }

    render() {
        const workLink = this.props.work

        /**
         * Work title with highlight
         */
        // TODO: highlight is not used
        // This code is duplicated from WorkDisplay
        // Except here we do not display icon
        // Display link type with full name, add episode infos...
        let title
        if (this.props.query != undefined) {
            title = (<div className="title">
                    <Highlighter
                        searchWords={this.props.query.works.concat(
                                this.props.query.remaining
                                )}
                        textToHighlight={workLink.work.title}
                    />
                </div>)
        } else {
            title = (<div className="title">{workLink.work.title}</div>)
        }

        /**
         * Subtitle if any
         */

        let subtitle
        if (workLink.work.subtitle) {
             subtitle = (<div className="subtitle">{workLink.work.subtitle}</div>)
        }

        /**
         * Link between song and work infos
         * with number if any
         */

        const link = (<span className="link-type">{workLink.link_type_name}</span>)
        let linkNb
        if (workLink.link_type_number) {
            linkNb = (<span className="link-nb">{" " + workLink.link_type_number}</span>)
        }

        /**
         * Episodes info if any
         */

        let episodes
        if(workLink.episodes) {
            episodes = (
                    <div className="episodes">
                        Episode {workLink.episodes}
                    </div>
                    )
        }

        return (
                <li className="sublisting-entry">
                    <div className="controls subcontrols">
                        <div className="control primary" onClick={this.handleSearchWork}>
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                    <div className="work">
                        {title}{subtitle}
                        <div className="link">
                            <span className="link-content">
                                {link}{linkNb}
                            </span>
                        </div>
                        {episodes}
                    </div>
                </li>
        )
    }
}
