import React, { Component } from 'react'
import SongPreviewDetails from './SongPreviewDetails'
import SongTagList from './SongTagList'
import Highlighter from 'react-highlight-words'

export default class SongPreview extends Component {
    render() {
        const song = this.props.song
        let titleContent
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

        const title = (<div className="title">{titleContent}</div>)

        let version
        if (song.version) {
            version = (<div className="version">{song.version} version</div>)
        }

        let tags
        let songPreviewDetails
        if (!this.props.expanded) {
            tags = (<SongTagList tags={song.tags} query={this.props.query}/>)
            songPreviewDetails = (<SongPreviewDetails song={song} query={this.props.query}/>)
        }

        return (
                <div className="song-preview" onClick={this.handleExpand}>
                    <div className="title-header">
                        {title}
                        {version}
                    </div>
                    {songPreviewDetails}
                    {tags}
                </div>
            )
    }
}
