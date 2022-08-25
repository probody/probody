import React from "react";
import {GlobalContext} from "../contexts/Global.js";
import PropTypes from "prop-types";
import InfoBlock from "./kit/InfoBlock";
import css from '../styles/kit/infotp.module.scss'
import Button from "./kit/Button.jsx";
import {cnb} from "cnbuilder";

export default class InfoTabPanels extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        title: PropTypes.string.isRequired,
        buttonText: PropTypes.string.isRequired,
        onActionClick: PropTypes.func,
        tabs: PropTypes.arrayOf(PropTypes.shape({
            pic: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            shortTitle: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired
        })).isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0
        }
    }

    render() {
        const {t, isMobile, theme} = this.context,
            activeTab = this.props.tabs[this.state.tabIndex]

        return isMobile ?
            <div className={cnb(css['theme--' + theme])}>
                <h1 className={'responsive-content'} style={{marginBottom: 16}}>{this.props.title}</h1>
                <div className={css.invisibleScroll}>
                    {this.props.tabs.map((tab, i) =>
                        <div key={i} className={css.mobileTab}>
                            <strong>{tab.shortTitle}</strong>
                            <div className={css.mobilePic} style={{backgroundImage: `url('${tab.pic}')`}}>&nbsp;</div>
                            <strong>{tab.title}</strong>
                            <p style={{margin: '17px 0 48px 0'}}>{tab.text}</p>
                            <Button onClick={this.props.onActionClick} size={'fill'}>{this.props.buttonText}</Button>
                        </div>
                    )}
                </div>
            </div>
            : <div className={css['theme--' + theme]}>
                <InfoBlock style={{padding: '40px 40px 60px 40px'}}>
                    <h1 className="bigger" style={{marginBottom: 32}}>{this.props.title}</h1>

                    <div className={css.tabsHead}>
                        {this.props.tabs.map((tab, i) =>
                            <span key={i} className={this.state.tabIndex === i ? css.active : ''}
                                  onClick={() => this.setState({tabIndex: i})}>{tab.shortTitle}</span>
                        )}
                    </div>

                    <div className={css.spacer}></div>

                    <div className="flex justify-between" style={{marginTop: 32}}>
                        <div className={css.pic} style={{backgroundImage: `url('${activeTab.pic}')`}}>&nbsp;</div>
                        <div style={{maxWidth: 490}}>
                            <h1>{activeTab.title}</h1>
                            <p style={{margin: '17px 0 48px 0'}} className={css.text}>{activeTab.text}</p>
                            <Button onClick={this.props.onActionClick} size={'large'}>{this.props.buttonText}</Button>
                        </div>
                    </div>
                </InfoBlock>
            </div>
    }
}
