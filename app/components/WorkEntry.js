import React from 'react';
import WorkDisplay from './WorkDisplay';

export default class WorkEntry extends React.Component {
    handleSearchWork = () => {
        var work = this.props.work.work;
        this.props.setQuery(work.work_type.query_name + ':""' + work.title + '""');
    }

    render() {
        var work = this.props.work;

        return (
                <li>
                    <WorkDisplay work={work}/>
                    <div className="controls">
                        <div className="control primary" onClick={this.handleSearchWork}>
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                </li>
        );
    }
}
