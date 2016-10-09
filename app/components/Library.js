var $ = jQuery = require('jquery');
var React = require('react');
var SongLibrary = require('./SongLibrary');
var ArtistLibrary = require('./ArtistLibrary');
var WorkLibrary = require('./WorkLibrary');
var utils = require('../dakara-utils');

var Library = React.createClass({

    getInitialState: function() {
        return {
            workTypes: [],
        }
    },

    refreshWorkTypes: function() {
        url = utils.params.url + "library/work-types/";
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    workTypes: data.results,
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function() {
        this.refreshWorkTypes();
    },

    render: function() {
        var library;
        var libraryName = "";
        if (this.props.libraryName) {
            libraryName = this.props.libraryName.toLowerCase();
        }
        if (libraryName == "artist") {
            library = ( <ArtistLibrary
                            ref="artistLibrary"
                            libraryParams={this.props.libraryParams}
                            navigator={this.props.navigator}
                        /> );
        
        } else {
            var foundWorkType;
            for (var i in this.state.workTypes) {
                    workType = this.state.workTypes[i];
                if (libraryName == workType.query_name) {
                    foundWorkType = workType;
                    break;
                }
            }

            if (foundWorkType) {
                library = ( <WorkLibrary
                                ref="workLibrary"
                                key={foundWorkType.query_name}
                                type={foundWorkType}
                                libraryParams={this.props.libraryParams}
                                navigator={this.props.navigator}
                            /> );
            } else {
                library = ( <SongLibrary
                                ref="songLibrary"
                                libraryParams={this.props.libraryParams}
                                playlistEntries={this.props.playlistEntries}
                                playerStatus={this.props.playerStatus}
                                addToPlaylist={this.props.addToPlaylist}
                                navigator={this.props.navigator}
                            /> );
                libraryName = "home";
            }
        }

        var workTabs = this.state.workTypes.map(function(workType) {
            var classActive = workType.query_name == libraryName ? " active" : "";
            var onClickFunction = function() {
                    this.props.navigator.setLibrary(workType.query_name);
                }.bind(this)
            return (
                <div
                    className={"library-tab library-tab-item" + classActive}
                    onClick={onClickFunction}
                >
                    <i className={"fa fa-" + workType.icon_name}></i>
                    {workType.name + "s"}
                </div>
                    
                    )
        }.bind(this));
        return (
        <div>
            <nav id="library-chooser">
                <div
                    className={"library-tab" + (libraryName == "home" ? " active" : "")}
                    id="library-tab-song"
                    onClick={function() {this.props.navigator.setLibrary("home")}.bind(this)}
                >
                    <i className="fa fa-home"></i>
                    
                </div>
                <div
                    className={"library-tab library-tab-item" + (libraryName == "artist" ? " active" : "")}
                    onClick={function() {this.props.navigator.setLibrary("artist")}.bind(this)}
                >
                    🎤
                    Artists
                </div>
                {workTabs}
            </nav>
            {library}
        </div>
        );
    }
});

module.exports = Library;
