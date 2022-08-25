import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import css from '../../styles/pages/personal.promotion.module.scss'
import Icon from "../kit/Icon.jsx";
import APIRequests from "../../helpers/APIRequests.js";
import {DateTime} from "luxon";
import Modal from "../kit/Modal.jsx";
import Button from "../kit/Button.jsx";
import {cnb} from "cnbuilder";

export default class RaiseArchive extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            raiseHistory: [],
            raiseToDelete: undefined,
            modal: ''
        }

        this.deleteRaise = this.deleteRaise.bind(this)
        this.getRaiseHistory = this.getRaiseHistory.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    deleteRaise() {
        APIRequests.cancelRaise(this.state.raiseToDelete).then(() => {
            this.getRaiseHistory()
            this.setState({
                modal: 'raiseDeleted'
            })
        })
    }

    componentDidMount() {
        this.getRaiseHistory()
    }

    closeModal() {
        this.setState({modal: ''})
    }

    getRaiseHistory() {
        APIRequests.getMySalonInfo().then(mySalon => {
            const currentDate = +new Date

            this.setState({raiseHistory: mySalon.raises.filter(i => +new Date(i) < currentDate)})
        })
    }

    render() {
        const {t, theme, isMobile} = this.context

        return <div className={cnb(css['theme--' + theme], 'responsive-content')}>
            <Modal open={this.state.modal === 'deletingRaise'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('deleteRaiseHistory')}</h1>

                        <p style={{paddingTop: 16}}>{t('afterDelete')}</p>

                        <div className={'flex items-center'} style={{gap: 8, marginTop: 28}}>
                            <img src={'/icons/calendar.svg'} width={20} height={20}/>
                            {t('date')}
                        </div>

                        <div className="flex align-end lineheight-1" style={{gap: 9, marginTop: 10}}>
                            <h2 className={'number-font lineheight-1'}>{DateTime.fromISO(this.state.raiseToDelete).toFormat('d MMMM, EEEE, H:mm')}</h2>
                        </div>

                        <div className={'flex growFirst'} style={{marginTop: isMobile ? 8 : 16, gap: 3}}>
                            <Button onClick={this.closeModal} size={'fill'}>{t('cancel')}</Button>
                            <Button onClick={this.deleteRaise} size={'fill'} color={'tertiary'}>{t('delete')}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'raiseDeleted'} isMobile={false} desktopWidth={350}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('youCanceledRaise')}</h1>

                        <p style={{paddingTop: 16}}>{t('toDate')} {DateTime.fromISO(this.state.raiseToDelete).toFormat('d.MM.yyyy, H:mm')}</p>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeModal}/>
                    </div>
                </div>
            </Modal>

            <div className={css.arrowBack} onClick={() => this.props.setView('main')}>
                <Icon name={'arrow_left'}/>
                <span>{t('back')}</span>
            </div>

            <h1 className={'bigger'} style={{marginTop: isMobile ? 32 : 48}}>{t('archive')}</h1>
            <p className="subtitle2" style={{marginTop: 20}}>{t('raiseHistory')}</p>

            <div>
                <div bp={'grid'} style={{padding: '20px 20px 10px 20px'}} className={'text-disabled'}>
                    <div bp={'4'}><b>{t('date')}</b></div>
                    <div bp={'8'}><b>{t('time')}</b></div>
                </div>
                {this.state.raiseHistory.map((raise, i) => {
                    const dt = DateTime.fromISO(raise)

                    return <div bp={'grid'} className={'outlined'} key={i} style={{marginBottom: 8}}>
                        <div bp={'4'}>{dt.toFormat('d.MM.yyyy')}</div>
                        <div bp={'4'}>{dt.toFormat('H:mm')}</div>
                        <div bp={'4'} className={'flex justify-end'}><img style={{cursor: "pointer"}} onClick={() => this.setState({
                            modal: 'deletingRaise',
                            raiseToDelete: raise
                        })} src={'/icons/trashcan_alt.svg'} width={24} height={24} /></div>
                    </div>
                })}
            </div>
        </div>
    }
}
