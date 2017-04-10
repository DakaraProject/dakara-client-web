import React, { Component } from 'react'
import Highlighter from 'react-highlight-words'

export default class WorkDisplay extends Component {
    render() {
        const workLink = this.props.work

        /**
         * Work title with highlight
         */
        // TODO: This code is duplicated in SongExpandedWorkEntry

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

        const link = (<span className="link-type">{workLink.link_type}</span>)
        let linkNb
        if (workLink.link_type_number) {
            linkNb = (<span className="link-nb">{workLink.link_type_number}</span>)
        }

        /**
         * Display work icon
         * or default icon if none
         */
        // TODO: set default icon from server

        let work_icon
        if (workLink.work.work_type && workLink.work.work_type.icon_name) {
            work_icon = "fa fa-" + workLink.work.work_type.icon_name
        } else {
            work_icon = "fa fa-picture-o"
        }

        return (
                <div className="work">
                    {title}
                    {subtitle}
                    <div className="link">
                        <span className="link-content">
                            {link}
                            {linkNb}
                        </span>
                    </div>
                    <div className="type">
                        <i className={work_icon}></i>
                    </div>
                </div>
            )
    }
}
