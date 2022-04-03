import PropTypes from 'prop-types'
import { parse } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { storeSearchBox } from 'actions/library'
import { withLocation, withSearchParams } from 'components/adapted/ReactRouterDom'

class SearchBox extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        placeholder: PropTypes.string.isRequired,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
    }

    state = {
        query: ''
    }

    componentDidMount() {
        this.updateQueryFromStore()
        this.updateQueryFromLocation()
    }

    componentDidUpdate(prevProps) {
        const newQueryStore = this.props.searchBox.query
        if (newQueryStore !== prevProps.searchBox.query) {
            this.updateQueryFromStore()
        }

        const newQueryLocation = parse(this.props.location.search).query
        if (newQueryLocation !== parse(prevProps.location.search).query) {
            this.updateQueryFromLocation()
        }
    }

    componentWillUnmount() {
        this.props.storeSearchBox(this.state.query)
    }

    updateQueryFromLocation = () => {
        const query = parse(this.props.location.search).query
        if (query && query.length > 0) {
            this.setState({query})
        }
    }

    updateQueryFromStore = () => {
        const query = this.props.searchBox.query
        if (query && query.length > 0) {
            this.setState({query})
        }
    }

    render() {
        return (
            <form
                className="form inline library-searchbox"
                onSubmit={e => {
                    e.preventDefault()
                    this.props.setSearchParams({query: this.state.query})
                }}
            >
                <div className="set">
                    <div className="field">
                        <div
                            className="text-input input fake"
                            id="library-searchbox-fake"
                        >
                            <input
                                className="faked"
                                placeholder={this.props.placeholder}
                                value={this.state.query}
                                onChange={e => this.setState({query: e.target.value})}
                                onFocus={() => {
                                    document.getElementById(
                                        'library-searchbox-fake'
                                    ).classList.add(
                                        'focus'
                                    )
                                }}
                                onBlur={() => {
                                    document.getElementById(
                                        'library-searchbox-fake'
                                    ).classList.remove(
                                        'focus'
                                    )
                                }}
                            />
                            <div className="controls">
                                <div className="control" onClick={e => {
                                        this.setState({query: ''})
                                        // clear query string
                                        this.props.setSearchParams({})
                                    }
                                }>
                                    <span className="icon">
                                        <i className="fa fa-times"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <button type="submit" className="control primary">
                        <span className="icon">
                            <i className="fa fa-search"></i>
                        </span>
                    </button>
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
    searchBox: state.library.searchBox
})

SearchBox = withSearchParams(withLocation(connect(
    mapStateToProps,
    { storeSearchBox }
)(SearchBox)))

export default SearchBox
