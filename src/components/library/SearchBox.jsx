import PropTypes from 'prop-types'
import { parse } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { storeSearchBox } from 'actions/library'
import { withLocation, withSearchParams } from 'components/adapted/ReactRouterDom'
import { CSSTransitionLazy } from 'components/adapted/ReactTransitionGroup'

class SearchBox extends Component {
    static propTypes = {
        help: PropTypes.element,
        location: PropTypes.object.isRequired,
        placeholder: PropTypes.string.isRequired,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
    }

    state = {
        query: '',
        displayHelp: false,
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
        this.props.storeSearchBox(this.state)
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

    toggleHelp = () => {
        this.setState({displayHelp: !this.state.displayHelp})
    }

    render() {
        const { help } = this.props
        const { displayHelp } = this.state

        /**
         * Help message
         */
        let helpButton
        let helpBox
        if (help) {
            helpButton = (
                <div className="control" onClick={e => {
                    this.toggleHelp()
                }}>
                    <span className="icon">
                        <i className="fa fa-question-circle"></i>
                    </span>
                </div>
            )

            helpBox = (
                <CSSTransitionLazy
                    in={displayHelp}
                    classNames="help"
                    timeout={{
                        enter: 300,
                        exit: 150
                    }}
                >
                    <div className="help">
                        {help}
                    </div>
                </CSSTransitionLazy>
            )
        }

        return (
            <div className="library-searchbox">
                <form
                    className="form inline"
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
                                    onChange={e => this.setState({
                                        query: e.target.value
                                    })}
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
                                    {helpButton}
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
                {helpBox}
            </div>
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
