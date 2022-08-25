import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import css from "../../styles/pages/personal.promotion.module.scss";
import Icon from "../kit/Icon.jsx";
import Link from "next/link.js";
import APIRequests from "../../helpers/APIRequests.js";
import {cnb} from "cnbuilder";
import InfoBlock from "../kit/InfoBlock";
import {formatPrice} from "../../helpers/String";
import Button from "../kit/Button.jsx";
import {DateTime} from "luxon";
import Modal from "../kit/Modal.jsx";
import {DISCOUNT_AMOUNT, RAISE_PRICE, SUBSCRIPTION_PRICE} from "../../helpers/constants.js";
import Select from "../kit/Form/Select";
import Calendar from "../kit/Calendar";

export default class Promotion extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            mySalon: {
                raises: []
            },
            personalInfo: {},
            raiseToDelete: undefined,
            modal: '',
            activeTab: 'otr',
            planningRaiseToDate: new Date,
            planningRaise: {
                time: '18:00',
                date: new Date
            },
        }

        this.closeModal = this.closeModal.bind(this)
        this.buySubscription = this.buySubscription.bind(this)
        this.getSalonInfo = this.getSalonInfo.bind(this)
        this.getMe = this.getMe.bind(this)
        this.raiseSalon = this.raiseSalon.bind(this)
        this.cancelRaise = this.cancelRaise.bind(this)
        this.planRaise = this.planRaise.bind(this)
    }

    componentDidMount() {
        this.getSalonInfo()
        this.getMe()
    }

    getSalonInfo() {
        APIRequests.getMySalonInfo().then(mySalon => {
            this.setState({mySalon})
        })
    }

    getMe() {
        APIRequests.getMe().then(personalInfo => {
            this.setState({personalInfo})
        })
    }

    closeModal() {
        this.setState({modal: ''})
    }

    buySubscription() {
        APIRequests.buySubscription().then(res => {
            if (res.status === 402) {
                this.setState({
                    modal: 'notEnoughMoney'
                })
            } else if (res.ok) {
                this.getMe()
                this.setState({
                    modal: 'subscriptionBought'
                })
            }
        })
    }

    planRaise() {
        APIRequests.planRaise(this.state.planningRaiseToDate).then(res => {
            if (res.status === 402) {
                this.setState({
                    modal: 'notEnoughMoney'
                })
            } else if (res.ok) {
                this.getMe()
                this.getSalonInfo()
                this.setState({
                    modal: 'plannedRaise'
                })
            }
        })
    }

    raiseSalon() {
        APIRequests.raiseSalon().then(res => {
            if (res.status === 402) {
                this.setState({
                    modal: 'notEnoughMoney'
                })
            } else if (res.status === 425) {
                this.setState({
                    modal: ''
                })
            } else if (res.ok) {
                this.getMe()
                this.getSalonInfo()
                this.setState({
                    modal: 'salonRaised'
                })
            }
        })
    }

    cancelRaise() {
        APIRequests.cancelRaise(this.state.raiseToDelete).then(() => {
            this.getSalonInfo()
            this.getMe()
            this.setState({
                modal: 'raiseCanceled'
            })
        })
    }

    render() {
        const {t, theme, isMobile} = this.context,
            currentDate = +new Date,
            isPro = +new Date(this.state.personalInfo.subscriptionTo) > currentDate,
            plannedRaises = this.state.mySalon.raises.filter(i => +new Date(i) > currentDate),
            pastRaises = this.state.mySalon.raises.filter(i => +new Date(i) < currentDate),
            CALCULATED_RAISE_PRICE = RAISE_PRICE * (1 - Number(isPro) * DISCOUNT_AMOUNT),
            raiseTimeOptions = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',
                '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
                '23:00', '23:30']
                .map(i => ({
                    _id: i,
                    name: i
                }))

        return <div className={cnb(css['theme--' + theme], 'responsive-content')}>
            <Modal open={this.state.modal === 'goPRO'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('goingPro')}</h1>

                        <p style={{paddingTop: 16}}>{t('attractMore')}</p>

                        <div className={css.spacer}></div>

                        <p style={{marginBottom: 20}} className="subtitle2">{t('pros')}</p>

                        <div className={'flex items-center tag-secondlayer'} style={{gap: 8, marginBottom: 16}}>
                            <img src={'/icons/pro_full.svg'} width={75} height={32}/>
                            {t('iconInProfile')}
                        </div>

                        <div className={'flex items-center tag-secondlayer'} style={{gap: 8}}>
                            <img src={'/icons/discount.svg'} width={20} height={20}/>
                            {t('raiseDiscount')}
                            <img src={'/icons/discount_tag.svg'} width={41} height={28}/>
                        </div>

                        <div className={css.spacer}></div>

                        <div className={'flex items-center tag-secondlayer'} style={{gap: 8, marginBottom: 12}}>
                            <img src={'/icons/cash_color.svg'} width={24} height={24}/>
                            {t('cost')}
                        </div>

                        <h2 className={'number-font'}>{formatPrice(SUBSCRIPTION_PRICE)}{t('kzt')}</h2>

                        <div className={'flex items-center tag-secondlayer'}
                             style={{gap: 8, marginTop: 22, marginBottom: 12}}>
                            <img src={'/icons/calendar.svg'} width={24} height={24}/>
                            {t('duration')}
                        </div>

                        <h2 className={'number-font'}>1 {t('month')} (30 {t('days')})</h2>

                        <div className={'flex growAll'} style={{marginTop: isMobile ? 8 : 16, gap: 3}}>
                            <Button onClick={this.buySubscription} size={'fill'}>{t('goPro')}</Button>
                            <Button onClick={this.closeModal} size={'fill'} color={'tertiary'}>{t('cancel')}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'subscriptionBought'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('youGonePro')}</h1>

                        <p style={{paddingTop: 16}}>{t('chargedFor')} {formatPrice(SUBSCRIPTION_PRICE)}{t('kzt')}</p>

                        <div className={css.spacer}></div>

                        <p style={{marginBottom: 20}} className="subtitle2">{t('activated')}</p>

                        <div className={'flex items-center tag-secondlayer'} style={{gap: 8, marginBottom: 16}}>
                            <img src={'/icons/pro_full.svg'} width={75} height={32}/>
                            {t('iconInProfile')}
                        </div>

                        <div className={'flex items-center tag-secondlayer'} style={{gap: 8}}>
                            <img src={'/icons/discount.svg'} width={20} height={20}/>
                            {t('raiseDiscount')}
                            <img src={'/icons/discount_tag.svg'} width={41} height={28}/>
                        </div>

                        <div className={css.spacer}></div>

                        <div className={'flex items-center tag-secondlayer'}
                             style={{gap: 8, marginTop: 22, marginBottom: 12}}>
                            <img src={'/icons/calendar.svg'} width={24} height={24}/>
                            {t('activeTo')}
                        </div>

                        <h2 className={'number-font'}>{DateTime.now().plus({days: 30}).toFormat('d.MM.yyyy')}</h2>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeModal}/>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'raisingSalon'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('raisingSalon')}</h1>

                        <p style={{paddingTop: 16}}>{t('yourSalonWillBeRaised')}</p>

                        <div className={'flex items-center'} style={{gap: 8, marginTop: 28}}>
                            <img src={'/icons/cash_color.svg'} width={20} height={20}/>
                            {t('cost')}
                            {isPro && <img src={'/icons/discount_tag.svg'} width={41} height={28}/>}
                        </div>

                        <div className="flex align-end lineheight-1" style={{gap: 9, marginTop: 10}}>
                            <h2 className={'number-font lineheight-1'}>{formatPrice(RAISE_PRICE * (1 - Number(isPro) * DISCOUNT_AMOUNT))}{t('kzt')}</h2>
                            <span className={css.oldPrice}>{isPro && RAISE_PRICE + t('kzt')}</span>
                        </div>

                        <div className={'flex growFirst'} style={{marginTop: isMobile ? 8 : 16, gap: 3}}>
                            <Button onClick={this.raiseSalon} size={'fill'}>{t('raise')}</Button>
                            <Button onClick={this.closeModal} size={'fill'} color={'tertiary'}>{t('cancel')}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'cancelingRaise'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('doYouWantToCancelRaise')}</h1>

                        <p style={{paddingTop: 16}}>{t('weWillReturnMoney')}</p>

                        <div className={'flex items-center'} style={{gap: 8, marginTop: 28}}>
                            <img src={'/icons/calendar.svg'} width={20} height={20}/>
                            {t('date')}
                        </div>

                        <div className="flex align-end lineheight-1" style={{gap: 9, marginTop: 10}}>
                            <h2 className={'number-font lineheight-1'}>{DateTime.fromISO(this.state.raiseToDelete).toFormat('d MMMM, EEEE, H:mm')}</h2>
                        </div>

                        <div className={'flex growFirst'} style={{marginTop: isMobile ? 8 : 16, gap: 3}}>
                            <Button onClick={this.closeModal} size={'fill'}>{t('cancel')}</Button>
                            <Button onClick={this.cancelRaise} size={'fill'} color={'tertiary'}>{t('delete')}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'planningRaise'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('planningRaise')}</h1>

                        <p style={{paddingTop: 16}}>{t('raiseWillBePlanned')}</p>

                        <div className={'flex items-center'} style={{gap: 8, marginTop: 28}}>
                            <img src={'/icons/calendar.svg'} width={20} height={20}/>
                            {t('date')}
                        </div>

                        <div className="flex align-end lineheight-1" style={{gap: 9, marginTop: 10}}>
                            <h2 className={'number-font lineheight-1'}>{DateTime.fromJSDate(this.state.planningRaiseToDate).toFormat('d MMMM, EEEE, H:mm')}</h2>
                        </div>

                        <div className={'flex items-center'} style={{gap: 8, marginTop: 28}}>
                            <img src={'/icons/cash_color.svg'} width={20} height={20}/>
                            {t('cost')}
                            {isPro && <img src={'/icons/discount_tag.svg'} width={41} height={28}/>}
                        </div>

                        <div className="flex align-end lineheight-1" style={{gap: 9, marginTop: 10}}>
                            <h2 className={'number-font lineheight-1'}>{formatPrice(RAISE_PRICE * (1 - Number(isPro) * DISCOUNT_AMOUNT))}{t('kzt')}</h2>
                            <span className={css.oldPrice}>{isPro && RAISE_PRICE + t('kzt')}</span>
                        </div>

                        <div className={'flex growFirst'} style={{marginTop: isMobile ? 8 : 16, gap: 3}}>
                            <Button onClick={this.planRaise} size={'fill'}>{t('plan')}</Button>
                            <Button onClick={this.closeModal} size={'fill'} color={'tertiary'}>{t('cancel')}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'raiseCanceled'} isMobile={false} desktopWidth={350}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('youCanceledRaise')}</h1>

                        <p style={{paddingTop: 16}}>{t('toDate')} {DateTime.fromISO(this.state.raiseToDelete).toFormat('d.MM.yyyy, H:mm')}<br/>{t('unChargedFor')} {formatPrice(CALCULATED_RAISE_PRICE)}{t('kzt')}
                        </p>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeModal}/>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'plannedRaise'} isMobile={false} desktopWidth={350}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('youHavePlannedRaise')}</h1>

                        <p style={{paddingTop: 16}}>{t('toDate')} {DateTime.fromJSDate(this.state.planningRaiseToDate).toFormat('d.MM.yyyy, H:mm')}<br/>{t('chargedFor')} {formatPrice(CALCULATED_RAISE_PRICE)}{t('kzt')}
                        </p>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeModal}/>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'replenishBalance'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>Пополнение баланса</h1>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeModal}/>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'salonRaised'} isMobile={false} desktopWidth={350}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('youHaveRaisedSalon')}</h1>

                        <p style={{paddingTop: 16}}>{t('youAreFirst')}<br/>{t('chargedFor')} {formatPrice(CALCULATED_RAISE_PRICE)}{t('kzt')}
                        </p>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeModal}/>
                    </div>
                </div>
            </Modal>

            <Modal open={this.state.modal === 'notEnoughMoney'} isMobile={false} desktopWidth={450}
                   onUpdate={this.closeModal}>
                <div>
                    <div className={css.modalBody}>
                        <div className={css.notEnoughMoney}>
                            <Icon name={'replenish'}/>
                            {t('notEnoughFunds')}
                        </div>

                        <h1>{t('notEnoughMoney')}</h1>

                        <p style={{paddingTop: 16}}>{t('pleaseReplenishBalance')}</p>

                        <div className={'flex growAll'} style={{marginTop: isMobile ? 8 : 16, gap: 3}}>
                            <Button onClick={() => this.setState({modal: 'replenishBalance'})}
                                    size={'fill'}>{t('replenishBalance')}</Button>
                            <Button onClick={this.closeModal} size={'fill'} color={'tertiary'}>{t('cancel')}</Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <div bp={'grid'} style={{marginBottom: 24}}>
                <h1 bp={'12 4@md'} className={'bigger inline-flex items-center lineheight-1'}>{t('salonArticle')}</h1>

                <div bp={'12 8@md'} className={'flex gap-12 justify-' + (isMobile ? 'start' : 'end')}>
                    <Link href={'/salon/new?edit=' + this.state.mySalon.slug}><p className={css.editSalonLink}>
                        <Icon name={'edit'}/>

                        {t('editSalon')}
                    </p></Link>

                    <Link href={'/salon/' + this.state.mySalon.slug}><p className={css.editSalonLink}>
                        <Icon name={'arrow_right_square'}/>

                        {t('toSalon')}
                    </p></Link>
                </div>
            </div>

            <div bp={'grid'} style={{gap: isMobile ? '20px 0' : '0 29px'}}>
                <div bp={'12 6@md'}>
                    <div className={'flex'} style={{gap: 4}}>
                        <div style={{flexGrow: 1}}>
                            <InfoBlock className={css.personalInfoBlock}>
                                <div className={'flex justify-between'}>
                                    <div>
                                        <Icon name={'wallet'}/>
                                        {t('balance')}
                                    </div>
                                    <Button size={'small'}
                                            onClick={() => this.setState({modal: 'replenishBalance'})}><Icon
                                        name={'plus'}/></Button>
                                </div>
                                <h2 className={'number-font'}>{formatPrice(this.state.personalInfo.balance || 0)} {t('kzt')}</h2>
                            </InfoBlock>
                        </div>

                        <InfoBlock className={css.personalInfoBlock}>
                            <div className={'flex justify-between'}>
                                <div>
                                    <Icon style={{width: 20, height: 20}} name={'position'}/>
                                    {t('salonPosition')}
                                </div>
                            </div>
                            <h2 className={'number-font'}>{this.state.mySalon.position || '-'}</h2>
                        </InfoBlock>
                    </div>
                </div>
                <div bp={'12 6@md first last@md'}>
                    <div className={cnb(css.goPro, isPro ? css.pro : '')}>
                        <div>
                            <img src={'/icons/pro_fill.svg'} width={24} height={24}/>
                            <p className={'subtitle2'}>{t(isPro ? 'pro' : 'standard')}</p>
                        </div>
                        {isPro ?
                            <span>{t('activeTo')} {DateTime.fromISO(this.state.personalInfo.subscriptionTo).toFormat('d.MM.yyyy')}</span> :
                            <Button onClick={() => this.setState({modal: 'goPRO'})} color={'secondary'}
                                    size={'small'}>{t('goPro')}</Button>}
                    </div>
                    <div className={css.proHint}>
                        <div><Icon name={'warning'}/></div>
                        <span>{isPro ? t('activeProInfo') : t('ifYouGoPro')}</span>
                    </div>
                </div>
            </div>

            <div bp={'grid'} style={{gap: isMobile ? '20px 0' : '0 29px', marginTop: 48}}>
                <div bp={'12 6@md'}>
                    <div className={'flex justify-between items-center'}>
                        <h1 className="bigger">{t('promotion')}</h1>

                        {pastRaises.length > 0 &&
                            <p className={css.editSalonLink} onClick={() => this.props.setView('archive')}>
                                <span style={{padding: '0 8px'}}>{t('archive')}</span>

                                <span className={css.cnt}>{pastRaises.length}</span>
                            </p>}
                    </div>

                    <div className={css.tabsHead} style={{marginTop: 28}}>
                            <span className={this.state.activeTab === 'otr' ? css.active : ''}
                                  onClick={() => this.setState({activeTab: 'otr'})}>{t('singleRaise')}</span>
                        <span className={this.state.activeTab === 'plan' ? css.active : ''}
                              onClick={() => this.setState({activeTab: 'plan'})}>{t('plan')}<span
                            className={cnb(css.cnt, this.state.activeTab === 'plan' ? css.active : '')}>{plannedRaises.length}</span></span>
                    </div>

                    <div className={css.spacer} style={{margin: '9px 0 16px 0'}}></div>

                    {this.state.activeTab === 'otr' ? <div className={'outlined'}>
                        <div className="flex justify-between">
                            <div className="flex" style={{gap: 9}}>
                                <img src="/icons/cash_color.svg" height={24} width={24}/>
                                <span>{t('singleRaiseCost')}</span>
                            </div>

                            <img src="/icons/discount_tag.svg" width={41} height={28}/>
                        </div>

                        <div className="flex justify-between align-end" style={{marginTop: 18}}>
                            <div className="flex align-end" style={{gap: 9, lineHeight: '26px'}}>
                                <h2 className={'number-font'}>{formatPrice(CALCULATED_RAISE_PRICE)}{t('kzt')}</h2>
                                <span className={css.oldPrice}>{isPro && RAISE_PRICE + t('kzt')}</span>
                            </div>

                            <Button size={'small'}
                                    onClick={() => this.setState({modal: 'raisingSalon'})}>{t('raise')}</Button>
                        </div>
                    </div> : <div>
                        <div className={'outlined'}>
                            <div className="flex justify-between">
                                <div className="flex" style={{gap: 9}}>
                                    <img src="/icons/cash_color.svg" height={24} width={24}/>
                                    <span>{t('singleRaiseCost')}</span>
                                </div>

                                <img src="/icons/discount_tag.svg" width={41} height={28}/>
                            </div>

                            <div className="flex justify-between align-end" style={{marginTop: 18}}>
                                <div className="flex align-end" style={{gap: 9, lineHeight: '26px'}}>
                                    <h2 className={'number-font'}>{formatPrice(RAISE_PRICE * (1 - Number(isPro) * DISCOUNT_AMOUNT))}{t('kzt')}</h2>
                                    <span className={css.oldPrice}>{isPro && RAISE_PRICE + t('kzt')}</span>
                                </div>
                            </div>
                        </div>

                        <p className="subtitle2" style={{marginTop: 32, marginBottom: 20}}>{t('chooseTimeAndDate')}</p>

                        <Calendar value={this.state.planningRaise.date} onUpdate={date => {
                            this.setState({
                                planningRaise: {
                                    ...this.state.planningRaise,
                                    date
                                }
                            })
                        }}/>

                        <div style={{marginTop: 12, marginBottom: 32}}>
                            <Select label={t('raiseTime')} onUpdate={time => {
                                this.setState({
                                    planningRaise: {
                                        ...this.state.planningRaise,
                                        time
                                    }
                                })
                            }} value={this.state.planningRaise.time} options={raiseTimeOptions} placeholder={''}/>
                        </div>

                        <Button size={'fill'} onClick={() => this.setState({
                            modal: 'planningRaise',
                            planningRaiseToDate: DateTime.fromJSDate(this.state.planningRaise.date).startOf('day').plus({
                                hours: Number(this.state.planningRaise.time.split(':')[0]),
                                minutes: Number(this.state.planningRaise.time.split(':')[1]),
                            }).toJSDate()
                        })}>{t('plan')}</Button>
                    </div>}
                </div>
                <div bp={'12 6@md'}>
                    <div className={'slCard'}>
                        <p className="subtitle2" style={{marginBottom: 24}}>{t('stayWithUs')}</p>

                        <div className={'flex column gap-12'}>
                            <div>– {t('guestStreamFrom')}&nbsp;
                                <div className={'inline-flex wrap gap-12'} style={{marginLeft: 14}}>
                                    <img src={'/icons/tg_color.svg'} width={14} height={14}/>
                                    <img src={'/icons/inst_color.svg'} width={14} height={14}/>
                                    <img src={'/icons/yt_color.svg'} width={14} height={14}/>
                                    <img src={'/icons/google_color.svg'} width={14} height={14}/>
                                    <img src={'/icons/yandex_color.svg'} width={14} height={14}/>
                                </div>
                            </div>

                            <div>– {t('ourContextAds')}</div>

                            <div>– {t('trueStatistics')}</div>
                        </div>
                    </div>

                    {(this.state.activeTab === 'plan' && plannedRaises.length > 0) && <div style={{marginTop: 32}}>
                        <p className="subtitle2">{t('planned')}</p>
                        <div bp={'grid'} style={{padding: '20px 20px 10px 20px'}} className={'text-disabled'}>
                            <div bp={'4'}><b>{t('date')}</b></div>
                            <div bp={'8'}><b>{t('time')}</b></div>
                        </div>
                        {plannedRaises.map((raise, i) => {
                            const dt = DateTime.fromISO(raise)

                            return <div bp={'grid'} className={'outlined'} key={i} style={{marginBottom: 8}}>
                                <div bp={'4'}>{dt.toFormat('d.MM.yyyy')}</div>
                                <div bp={'4'}>{dt.toFormat('H:mm')}</div>
                                <div bp={'4'} className={'flex justify-end'}><img style={{cursor: "pointer"}}
                                                                                  onClick={() => this.setState({
                                                                                      modal: 'cancelingRaise',
                                                                                      raiseToDelete: raise
                                                                                  })} src={'/icons/trashcan_alt.svg'}
                                                                                  width={24} height={24}/></div>
                            </div>
                        })}
                    </div>}
                </div>
            </div>
        </div>
    }
}
