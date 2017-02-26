import React from 'react';
import Highlighter from 'react-highlight-words';

export default class WorkDisplay extends React.Component {
    render() {
        var w = this.props.work;
        var title;
        if (this.props.query != undefined) {
            title = (<div className="title">
                    <Highlighter
                        searchWords={this.props.query.works.concat(
                                this.props.query.remaining
                                )}
                        textToHighlight={w.work.title}
                    />
                </div>);
        } else {
            title = (<div className="title">{w.work.title}</div>);
        }

        var subtitle;
        if (w.work.subtitle) {
             subtitle = (<div className="subtitle">{w.work.subtitle}</div>);
        }

        var link = (<span className="link-type">{w.link_type}</span>);
        var linkNb;
        if (w.link_type_number) {
            linkNb = (<span className="link-nb">{w.link_type_number}</span>);
        }

        var work_icon;
        if (w.work.work_type && w.work.work_type.icon_name) {
            work_icon = "fa fa-" + w.work.work_type.icon_name;
        } else {
            work_icon = "fa fa-picture-o";
        }

        return (
                <div className="work">
                    {title}{subtitle}<div className="link"><span className="link-content">{link}{linkNb}</span></div><div className="type"><i className={work_icon}></i></div>
                </div>
            )
    }
}
