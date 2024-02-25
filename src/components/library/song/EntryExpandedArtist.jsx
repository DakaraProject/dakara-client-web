import { Component } from 'react'

import ArtistWidget from 'components/song/ArtistWidget'
import { artistPropType } from 'serverPropTypes/library'

export default class SongEntryExpandedArtist extends Component {
    static propTypes = {
        artist: artistPropType.isRequired,
    }

    handleSearchArtist = () => {
        this.props.setQuery(`artist:""${this.props.artist.name}""`)
    }

    render() {
        const artist = this.props.artist
        return (
                <li className="sublisting-entry">
                    <div className="controls subcontrols">
                        <button
                            className="control primary"
                            onClick={this.handleSearchArtist}
                        >
                            <span className="icon">
                                <i className="las la-search"></i>
                            </span>
                        </button>
                    </div>
                    <ArtistWidget artist={artist} noIcon/>
                </li>
        )
    }
}
