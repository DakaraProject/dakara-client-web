import React, { Component } from 'react'

export default class SongExpandedArtistEntry extends Component {
    handleSearchArtist = () => {
        this.props.setQuery('artist:""' + this.props.artist.name + '""')
    }

    render() {
        const artist = this.props.artist
        return (
                <li className="sublisting-entry">
                    <div className="controls subcontrols">
                        <div className="control primary" onClick={this.handleSearchArtist}>
                            <i className="fa fa-search"></i>
                        </div>
                    </div>
                    <div className="artist">
                        <div className="name">
                            {artist.name}
                        </div>
                    </div>
                </li>
        )
    }
}
