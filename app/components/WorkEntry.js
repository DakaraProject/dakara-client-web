var React = require('react');

var WorkEntry = React.createClass({
    handleSearchWork: function() {
        var work = this.props.work.work;
        this.props.setQuery(work.work_type.query_name + ':""' + work.title + '""');
    },

    render: function() {
        var work = this.props.work;
        var title;
        if (this.props.query != undefined) {
            title = (<div className="title">
                    <Highlighter
                        searchWords={this.props.query.works.concat(
                                this.props.query.remaining
                                )}
                        textToHighlight={work.work.title}
                    />
                </div>);
        } else {
            title = (<div className="title">{work.work.title}</div>);
        }

        var subtitle;
        if (work.work.subtitle) {
             subtitle = (<div className="subtitle">{work.work.subtitle}</div>);
        }

        var link = (<span className="link-type">{work.link_type_name}</span>);
        var linkNb;
        if (work.link_type_number) {
            linkNb = (<span className="link-nb">{" " + work.link_type_number}</span>);
        }

        var episodes;

        if(work.episodes) {
            episodes = (
                    <div className="episodes">
                        Episode {work.episodes}
                    </div>
                    );
        }

        return (
                <li className="entry">
                    <div className="controls">
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
        );
    }
});

module.exports = WorkEntry;
