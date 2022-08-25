import React from "react";
import css from "../../styles/registeredmodal.module.scss";
import Button from "../kit/Button.jsx";
import {GlobalContext} from "../../contexts/Global.js";
import {withRouter} from "next/router.js";

class ChangedPasswordModal extends React.Component {
    static contextType = GlobalContext

    render() {
        const {t, openModal, theme} = this.context

        return (<div className={css['theme--' + theme]}>
            <div className={css.modalBody}>
                <p>{t('cool')}</p>

                <h1>{t('restoredLogin')}</h1>

                <p className={'additional-text'}>{t('findYourselfSalon')}</p>

                <Button style={{marginTop: 24}} size={'fill'} onClick={() => openModal('')}>{t('toMainPage')}</Button>
            </div>
        </div>);
    }
}

export default withRouter(ChangedPasswordModal);
