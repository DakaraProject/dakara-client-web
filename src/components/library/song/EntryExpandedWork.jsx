import React, { Component } from 'react'

import WorkLinkWidget from 'components/song/WorkLinkWidget'
import { workLinkPropType } from 'serverPropTypes/library'

export default class SongEntryExpandedWork extends Component {
    static propTypes = {
        work: workLinkPropType.isRequired,
    }

    handleSearchWork = () => {
        const work = this.props.work.work
        this.props.setQuery(`${work.work_type.query_name}:""${work.title}""`)
    }

    render() {
        return (
            <li className="sublisting-entry">
                <div className="controls subcontrols">
                    <button
                        className="control primary"
                        onClick={this.handleSearchWork}
                    >
                        <span className="icon">
                            <i className="las la-search"></i>
                        </span>
                    </button>
                </div>
                <WorkLinkWidget
                    workLink={this.props.work}
                    longLinkType
                    noIcon
                />
            </li>
        )
    }
}
