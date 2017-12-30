import React from 'react'
import WorkDisplay from 'components/song/WorkDisplay'

export default class SongExpandedWorkEntry extends WorkDisplay {
    handleSearchWork = () => {
        const work = this.props.work.work
        this.props.setQuery(work.work_type.query_name + ':""' + work.title + '""')
    }

    render() {
        const workLink = this.props.work

        /**
         * Work title with highlight
         */

        const title = this.getTitle()

        /**
         * Subtitle if any
         */

        const subtitle = this.getSubtitle()

        /**
         * Link between song and work infos
         * with number if any
         */

        const link = this.getLink(workLink.link_type_name)

        /**
         * Episodes info if any
         */

        let episodes
        if(workLink.episodes) {
            episodes = (
                    <span className="episodes">
                        Episode {workLink.episodes}
                    </span>
                    )
        }

        return (
                <li className="sublisting-entry">
                    <div className="controls subcontrols">
                        <button className="control primary" onClick={this.handleSearchWork}>
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                    <div className="work-display">
                        {title}
                        {subtitle}
                        {link}
                        {episodes}
                    </div>
                </li>
        )
    }
}
