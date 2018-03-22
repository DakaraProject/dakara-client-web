import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parse } from 'query-string'
import PropTypes from 'prop-types'
import Library from './Library'
import NotFound from 'components/navigation/NotFound'
import SongList, { getSongLibraryNameInfo } from './song/List'
import ArtistList, { getArtistLibraryNameInfo } from './artist/List'
import WorkList, { getWorkLibraryNameInfo } from './work/List'
import { loadLibraryEntries } from 'actions/library'
import { workTypeLibraryPropType } from 'reducers/library'
import { Status } from 'reducers/alterationsStatus'

class List extends Component {
    static propTypes = {
        workTypeLibrary: workTypeLibraryPropType,
        location: PropTypes.object.isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({
                libraryType: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        loadLibraryEntries: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const queryObj = parse(this.props.location.search)
        const prevqueryObj = parse(prevProps.location.search)
        // since there is only one `LibraryListWork` component, it is not unmounted
        // when navigating through work types, so we have to watch when the
        // component is updated wether we have jumped to another work type
        if (this.props.match.params.libraryType != prevProps.match.params.libraryType ||
            this.props.workTypeLibrary.status != prevProps.workTypeLibrary.status ||
            queryObj.page != prevqueryObj.page ||
            queryObj.query != prevqueryObj.query) {
            this.refreshEntries()
        }
    }

    checkWorkTypesHasFetched = () => {
        return this.props.workTypeLibrary.status == Status.successful
    }

    /**
     * Check library type exists: 'song' or 'artist' or contained in worktypes
     */
    checkLibraryTypeExists = () => {
        const { workTypeLibrary } = this.props
        const { libraryType } = this.props.match.params

        if (['song', 'artist'].includes(libraryType)) {
            return true
        }

        const workTypeMatched = workTypeLibrary.data.workTypes.find(
            (workTypeObject) => workTypeObject.query_name == libraryType
        )

        return !!workTypeMatched
    }

    refreshEntries = () => {
        const libraryType = this.props.match.params.libraryType
        const queryObj = parse(this.props.location.search)
        const { page: pageNumber, query } = queryObj

        if (!this.checkWorkTypesHasFetched() || !this.checkLibraryTypeExists()) {
            return
        }

        let args = {}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadLibraryEntries(libraryType, args)
    }

    render() {
        const { workTypeLibrary, location } = this.props
        const { libraryType } = this.props.match.params

        if (!this.checkWorkTypesHasFetched()) {
            return null
        }

        if (!this.checkLibraryTypeExists()) {
            return (
                <NotFound location={location}/>
            )
        }

        let ListComponent
        let getLibraryNameInfo
        switch (libraryType) {
            case "song":
                ListComponent = SongList
                getLibraryNameInfo = getSongLibraryNameInfo
                break

            case "artist":
                ListComponent = ArtistList
                getLibraryNameInfo = getArtistLibraryNameInfo
                break

            default:
                ListComponent = WorkList
                getLibraryNameInfo = getWorkLibraryNameInfo
                break
        }

        const libraryNameInfo = getLibraryNameInfo(libraryType, workTypeLibrary.data.workTypes)

        return (
            <Library
                location={this.props.location}
                match={this.props.match}
                nameInfo={libraryNameInfo}
                workTypeLibrary={workTypeLibrary}
            >
                <ListComponent
                    libraryType={libraryType}
                    location={location}
                />
            </Library>
        )
    }
}

const mapStateToProps = (state) => ({
    workTypeLibrary: state.library.workType,
})

List = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(List)

export default List
