import React from "react";
import PropTypes from "prop-types";
import {GlobalContext} from "../../contexts/Global.js";
import ProgressBar from "./ProgressBar.jsx";

export default class Stepper extends React.Component {
    static contextType = GlobalContext;
    static propTypes = {
        step: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        steps: PropTypes.array.isRequired,
    }

    render() {
        const {isMobile} = this.context;

        return <div>
            <div style={{marginBottom: isMobile ? 24 : 32}}>
                {isMobile ? (
                    <div style={{marginTop: -40, userSelect: 'none'}}>
                        <ProgressBar mobile={true} value={(this.props.step + 1) / this.props.steps.length} />

                        <div style={{margin: '0 16px'}}>
                            <h1 className={'inline-block number-font'} style={{marginTop: 12}}>{this.props.step + 1}</h1> <span style={{color: '#9a9a9a'}} className={'caption'}>/ {this.props.steps.length}</span></div>
                    </div>
                ) : (
                    <div bp={'grid 6'} style={{marginBottom: 16}}>
                        <h1 style={{marginBottom: -10}}>{this.props.title}</h1>
                        <div className={'flex justify-end align-end non-selectable'}>
                            <div style={{marginRight: 8, marginBottom: -10}}><h1 className={'inline-block number-font'}>{this.props.step + 1}</h1> <span style={{color: '#9a9a9a'}} className={'caption'}>/ {this.props.steps.length}</span></div>
                            <div style={{width: '80%'}}><ProgressBar value={(this.props.step + 1) / this.props.steps.length} /></div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {this.props.steps[this.props.step]}
            </div>
        </div>
    }
}
