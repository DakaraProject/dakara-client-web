import React from 'react';
import SongPreviewDetails from './SongPreviewDetails';
import SongTagList from './SongTagList';
import Highlighter from 'react-highlight-words';

export default class SongPreview extends React.Component {
    handleExpand = () => {
        this.props.handleExpand(!this.props.expanded);
    }

    render() {
        var song = this.props.song;
        var titleContent;
        if (this.props.query != undefined) {
            titleContent = (
                        <Highlighter
                            highlightClassName='highlight'
                            searchWords={this.props.query.titles.concat(
                                    this.props.query.remaining
                                    )}
                            textToHighlight={song.title}
                        />
                    )
        } else {
            titleContent = song.title
        }
        var title = (<div className="title">{titleContent}</div>);

        var detail;
        if (song.detail && this.props.expanded) {
            detail = (<div className="detail">{song.detail}</div>);
        }
        var tags;
        var songPreviewDetails;
        if (!this.props.expanded) {
            tags = (<SongTagList tags={song.tags} query={this.props.query}/>);
            songPreviewDetails = (<SongPreviewDetails song={song} query={this.props.query}/>);
        }

        return (
                <div className="song-preview" onClick={this.handleExpand}>
                    <div className="title-header">
                        {title}
                        {detail}
                    </div>
                    {songPreviewDetails}
                    {tags}
                </div>
            )
    }
}
