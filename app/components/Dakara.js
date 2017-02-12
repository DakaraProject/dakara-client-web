var $ = jQuery = require('jquery');
var React = require('react');
var withRouter = require('react-router').withRouter;
var Player = require('./Player');
var Playlist = require('./Playlist');
var Libraries = require('./Libraries');
var utils = require('../dakara-utils');

var Dakara = React.createClass({
    getInitialState: function() {
        return {
            playerStatus: {
                playlist_entry: null,
                timing: 0
            },
            playlistEntries: {
                count: 0,
                results: []
            },
            userCmd: {
                pause: false,
                skip: false
            },
            playerErrorsOldId: []
        };
    },

    sendPlayerCommand : function(cmd, callback) {
        $.ajax({
        url: utils.params.url + "playlist/player/manage/",
        dataType: 'json',
        type: 'PUT',
        data: cmd,
        success: function(data) {
            callback(true, cmd);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false, cmd);
            console.error(utils.params.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },

    removeEntry : function(entryId, callback) {
        $.ajax({
        url: utils.params.url + "playlist/" + entryId + "/",
        dataType: 'json',
        type: 'DELETE',
        success: function(data) {
            callback(true);
            this.loadStatusFromServer();
        }.bind(this),
        error: function(xhr, status, err) {
            callback(false);
            console.error(utils.params.url, status, err.toString() + xhr.responseText);
        }.bind(this)
        }); 
    },


    loadStatusFromServer: function() {
        $.ajax({
            url: utils.params.url + "playlist/player/status/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({playerStatus: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(utils.params.url, status, err.toString());
            }.bind(this),
            statusCode: {
                403: function() {
                   window.location = utils.params.url + "api-auth/login/?next=/"; 
                }.bind(this)
            }
        });
        $.ajax({
          url: utils.params.url + "playlist/",
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({playlistEntries: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(utils.params.url, status, err.toString());
          }.bind(this)
        });
        $.ajax({
            url: utils.params.url + "playlist/player/manage/",
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({userCmd: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(utils.params.url, status, err.toString());
            }.bind(this)
        });
        $.ajax({
            url: utils.params.url + "playlist/player/errors/",
            dataType: 'json',
            cache: false,
            success: this.addPlayerErrors,
            error: function(xhr, status, err) {
              console.error(utils.params.url, status, err.toString());
            }.bind(this)
        });
    },

    addPlayerErrors: function (data) {
        // add player errors to notification if they are new
        if (data) {
            var errorsId = [];
            for (error of data) {
                if (this.state.playerErrorsOldId.indexOf(error.id) == -1) {
                    errorsId.push(error.id);
                    this.refs.player.addNotification(
                            "Error with " + error.song.title + ": " + error.error_message,
                            "danger",
                            5000
                            );
                }
            }
            this.setState({playerErrorsOldId: this.state.playerErrorsOldId.concat(errorsId)});
        }
    },

    addToPlaylist: function(songId, callback) {
        $.ajax({
            url: utils.params.url + "playlist/",
            dataType: 'json',
            type: 'POST',
            data: {"song": songId},
            success: function(data) {
                callback(true);
                this.loadStatusFromServer();
            }.bind(this),
            error: function(xhr, status, err) {
                callback(false);
                console.error(utils.params.url, status, err.toString() + xhr.responseText);
            }.bind(this)
        }); 
    },

    componentDidMount: function() {
      this.loadStatusFromServer();
      setInterval(this.loadStatusFromServer, utils.params.pollInterval);
    },

    setLibrary: function(library) {
        /* Switch the library tab
         * Reinitialize the library params
         *
         * @param library
         *  name of the library to display
         */
        this.pushQueryString({
            library: library,
            query: "",
            page: 1,
            expanded: null
        })
    },

    setQuerySong: function(query) {
        /* Switch current library to Song
         * Perform the search query
         * Reinitialize the the other library params
         *
         * @param query
         *  string to search, formatted with the query mini language
         */
        this.pushQueryString({
            library: 'home',
            query: query,
            page: 1,
            expanded: null
        })
    },

    setQuerySongAndExpanded: function(query, expandedId) {
        /* Switch current library to Song
         * Perform the search query
         * Reinitialize the the other library params
         *
         * @param query
         *  string to search, formatted with the query mini language
         */
        this.pushQueryString({
            library: 'home',
            query: query,
            page: 1,
            expanded: expandedId
        })
    },

    setQueryCurrent: function(query) {
        /* Perform the search query
         * Reinitialize the the other library params
         *
         * @param query
         *  string to search, formatted with the query mini language
         */
        this.pushQueryString({
            query: query,
            page: 1,
            expanded: null
        })
    },

    setPage: function(page) {
        /* Change the page for the listing
         *
         * @param page
         *  page number
         */
        this.pushQueryString({
            page: page,
            expanded: null
        })
    },

    setExpanded: function(id) {
        /* Expand the corresponding item, collapse any other expanded item
         *
         * @param id
         *  ID of the item to expand
         *  if null, collapse everything and expand nothing
         */
        this.pushQueryString({
            expanded: id
        })
    },

    pushQueryString: function(queryDict) {
        /* Change the query string of the URL
         *
         * @param queryDict
         *  dictionnary of query string elements to add or update
         *  there is no control over the accepted keys
         */
        var query = $.extend(true, {}, this.props.location.query, queryDict);
        var location = $.extend(true, {}, this.props.location, {query: query});
        this.props.router.push(location);
    },

    getCurrentLibraryParams: function() {
        /* Return a dictionary containing the display parameters of the current library
         *
         * @return
         *  dictionnary containing:
         *      query: for the search query,
         *      page: the page number,
         *      expanded: the id of the expanded item in the list
         */
        return {
            query: this.props.location.query.query || "",
            page: this.props.location.query.page || 1,
            expanded: this.props.location.query.expanded || null
        }
    },

    getChildContext: function() {
        /* Populate the context
         */
        return {
            // populate the navigator
            navigator: {
                setQuerySong: this.setQuerySong,
                setQuerySongAndExpanded: this.setQuerySongAndExpanded
            }
        }
    },

    getNavigator: function() {
        /* Populate the navigator for passing through the props
         */
        return {
            setLibrary: this.setLibrary,
            setQueryCurrent: this.setQueryCurrent,
            setPage: this.setPage,
            setExpanded: this.setExpanded
        }
    },

    childContextTypes: {
        navigator: React.PropTypes.object
    },

    render: function() {
        return (
            <div id="dakara">
                <div id="playerbox">
                    <Player
                        ref="player"
                        playerStatus={this.state.playerStatus}
                        sendPlayerCommand={this.sendPlayerCommand}
                        userCmd={this.state.userCmd}
                    />
                    <Playlist
                        entries={this.state.playlistEntries}
                        playerStatus={this.state.playerStatus}
                        removeEntry={this.removeEntry}
                    />
                </div>
                <Libraries
                    libraryName={this.props.location.query.library}
                    libraryParams={this.getCurrentLibraryParams()}
                    playlistEntries={this.state.playlistEntries}
                    playerStatus={this.state.playerStatus}
                    addToPlaylist={this.addToPlaylist}
                    navigator={this.getNavigator()}
                />
            </div>
        );
    }

}); 

module.exports = withRouter(Dakara);
