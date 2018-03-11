import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsTabList from './TabList'
import { FormBlock, SelectField } from 'components/generics/Form'

class KaraStatus extends Component {

    render() {
        return (
            <div className="box" id="kara-status">
                <SettingsTabList/>
                <div className="box-header">
                    <h1>Kara status management</h1>
                </div>
                <FormBlock
                    title="Edit kara status"
                    action="playlist/kara-status/"
                    method="PUT"
                    submitText="Set"
                    formName="editKaraStatus"
                    successMessage="Kara status sucessfully updated!"
                    noClearOnSuccess
                >
                    <SelectField
                        id="status"
                        label="Status"
                        defaultValue={this.props.karaStatus.status}
                        options={[
                            {value: 'stop', name: 'Stop'},
                            {value: 'pause', name: 'Pause'},
                            {value: 'play', name: 'Play'},
                        ]}
                    />
                </FormBlock>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    karaStatus: state.player.digest.data.kara_status,
})

KaraStatus = connect(
    mapStateToProps,
    {}
)(KaraStatus)

export default KaraStatus
