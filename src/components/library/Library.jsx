import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { loadWorkTypes } from 'actions/library'
import Tab from 'components/generics/Tab'
import { Status } from 'reducers/alterationsResponse'
import { workTypeStatePropType } from 'reducers/library'

class Library extends Component {
    static propTypes = {
        loadWorkTypes: PropTypes.func.isRequired,
        workTypeState: workTypeStatePropType.isRequired,
    }

    componentDidMount() {
        this.props.loadWorkTypes()
    }

    render() {
        const { workTypeState } = this.props

        /**
         * Work Types links
         */

        let workTypesTabs
        if (workTypeState.status === Status.successful) {
            workTypesTabs = this.props.workTypeState.data.workTypes.map(
                (workType) => (
                    <Tab
                        key={workType.query_name}
                        to={`/library/${workType.query_name}`}
                        iconName={workType.icon_name}
                        name={workType.name_plural}
                    />
                )
            )
        }

        return (
            <div id="library" className="box">
                <nav className="tab-bar">
                    <Tab
                        to="/library/song"
                        iconName="music"
                        extraClassName="home"
                    />
                    <Tab
                        to="/library/artist"
                        iconName="microphone-alt"
                        name="Artists"
                    />
                    {workTypesTabs}
                </nav>
                <Outlet />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    workTypeState: state.library.workType,
})

Library = connect(
    mapStateToProps,
    {
        loadWorkTypes,
    }
)(Library)

export default Library
