import React from 'react'
import WorkDisplay from './WorkDisplay'

export default class SongPreviewWork extends WorkDisplay {
    render() {
        const workLink = this.props.work

        /**
         * Work title with highlight
         */
        const title = this.getTitle(this.props.query)

        /**
         * Subtitle if any
         */

        const subtitle = this.getSubtitle()

        /**
         * Link between song and work infos
         * with number if any
         */

        const link = this.getLink(workLink.link_type)

        /**
         * Display work icon
         * or default icon if none
         */
        // TODO: set default icon from server

        let workIcon
        if (workLink.work.work_type && workLink.work.work_type.icon_name) {
            workIcon = "fa fa-" + workLink.work.work_type.icon_name
        } else {
            workIcon = "fa fa-picture-o"
        }

        return (
                <div className="work-display">
                    {title}
                    {subtitle}
                    {link}
                    <span className="type">
                        <i className={workIcon}></i>
                    </span>
                </div>
            )
    }
}
