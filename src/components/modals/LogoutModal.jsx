import React from "react";
import css from "../../styles/registeredmodal.module.scss";
import Button from "../kit/Button.jsx";
import {GlobalContext} from "../../contexts/Global.js";
import {withRouter} from "next/router.js";
import Icon from "../kit/Icon.jsx";
import UserHelper from "../../helpers/UserHelper.js";

class LogoutModal extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.logOut = this.logOut.bind(this)
    }

    logOut() {
        UserHelper.logOut()
        this.context.openModal('')
        this.props.router.push('/')
    }

    render() {
        const {t, openModal, theme} = this.context

        return (<div className={css['theme--' + theme]}>
            <div className={css.modalBody}>
                <h1>{t('qLogOut')}</h1>

                <p className={'additional-text'}>{t('approveLogout')}</p>

                <Button style={{marginTop: 24}} size={'fill'} color={'tertiary'} onClick={this.logOut}>{t('exit')}</Button>

                <Icon name={'close'} className={css.modalClose} onClick={() => openModal('')}/>
            </div>
        </div>);
    }
}

export default withRouter(LogoutModal);
