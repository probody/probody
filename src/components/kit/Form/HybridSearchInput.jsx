import css from '../../../styles/kit/forms/hybrid-search-input.module.scss';
import React from "react";
import Icon from "../Icon.jsx";
import PropTypes from "prop-types";
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../../contexts/Global.js";
import Select from "./Select";
import {withRouter} from "next/router.js";
import ControlledInput from "./ControlledInput.jsx";
import Numbers from "../../../helpers/Numbers.js";
import UserHelper from "../../../helpers/UserHelper.js";

class HybridSearchInput extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        searchPlaceholder: PropTypes.string.isRequired,
        geoPlaceholder: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            regions: [],
            myRegion: '',
            inputId: 'text-input-' + Numbers.random(0, 99999),
            selectId: 'select-' + Numbers.random(0, 99999),
        }

        this.setRegion = this.setRegion.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.initRegionSelect = this.initRegionSelect.bind(this)
    }

    UNSAFE_componentWillReceiveProps() {
        this.initRegionSelect()
    }

    componentDidMount() {
        this.initRegionSelect()
    }

    setRegion(region) {
        this.setState({
            myRegion: region
        })

        UserHelper.setRegion(region)

        this.context.setQuery(this.context.query + ' ')
    }

    initRegionSelect() {
        if (this.state.regions.length) {
            return
        }

        const regions = UserHelper.regions(),
            myRegion = UserHelper.currentRegion()?.name

        if (regions) {
            this.setState({
                regions: regions.map(r => ({_id: r.name, name: r.name})),
                myRegion
            })
        }
    }

    handleKeyUp(e) {
        if (e.key === 'Enter') {
            this.props.router.push('/')
        }
    }

    render() {
        const {theme, query, setQuery} = this.context;
        const {inputId, selectId} = this.state

        return <div className={css['theme--' + theme]}>
            <div className={cnb('flex', css.root)}>
                <label htmlFor={inputId} bp={'fill flex'} className={css.inputGroup} style={{paddingLeft: 16}}>
                        <Icon name={'search'}/>
                        <ControlledInput id={inputId} bp={'fill'} type="text" value={query}
                                         onKeyUp={this.handleKeyUp}
                                         onChange={e => setQuery(e.target.value)}
                                         placeholder={this.props.searchPlaceholder}/>
                        <div onClick={() => setQuery('')}><Icon name={'close'}/></div>
                </label>
                <div className={css.rightSplitter}>&nbsp;</div>
                <div className={cnb(css.inputGroup, 'flex')} style={{paddingRight: 16}} onClick={() => window.document.getElementById(selectId).click()}>
                        <Icon name={'geo'}/>
                        {this.state.regions.length &&
                            <Select className={css.customSelect} label={''} options={this.state.regions} id={selectId}
                                    placeholder={this.props.geoPlaceholder} value={this.state.myRegion}
                                    onUpdate={val => this.setRegion(val)}/>}
                        <div onClick={() => this.setRegion('Алматы')}><Icon name={'close'}/></div>
                </div>
            </div>
        </div>
    }
}

export default withRouter(HybridSearchInput);
