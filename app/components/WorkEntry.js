var React = require('react');
var WorkDisplay = require('./WorkDisplay');

var WorkEntry = React.createClass({
    handleSearchWork: function() {
        var work = this.props.work.work;
        this.props.setQuery(work.work_type.query_name + ':""' + work.title + '""');
    },

    render: function() {
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
});

module.exports = WorkEntry;
