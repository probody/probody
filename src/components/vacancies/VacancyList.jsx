import React from "react";
import Button from "../kit/Button.jsx";
import {GlobalContext} from "../../contexts/Global.js";
import APIRequests from "../../helpers/APIRequests.js";
import css from '../../styles/pages/personal.vacancy.module.scss'
import Link from "next/link.js";
import ImageCarousel from "../kit/ImageCarousel.jsx";
import {cnb} from "cnbuilder";
import {formatPrice} from "../../helpers/String.js";
import Icon from "../kit/Icon.jsx";
import Modal from "../kit/Modal.jsx";

export default class VacancyList extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            vacancies: [],
            deleteDialogOpen: false,
            deletingVacancy: ''
        }

        this.closeDeleteDialog = this.closeDeleteDialog.bind(this)
        this.getMyVacancies = this.getMyVacancies.bind(this)
    }

    closeDeleteDialog() {
        this.setState({
            deleteDialogOpen: false,
            deletingVacancy: ''
        })
    }

    componentDidMount() {
        this.getMyVacancies()
    }

    getMyVacancies() {
        APIRequests.getMyVacancies().then(vacancies => {
            this.setState({vacancies: vacancies || []})
        })
    }

    render() {
        const {t, theme, isMobile} = this.context

        return <div className={css['theme--' + theme]}>
            <Modal open={this.state.deleteDialogOpen} isMobile={false} desktopWidth={375}
                   onUpdate={this.closeDeleteDialog}>
                <div>
                    <div className={css.modalBody}>
                        <h1>{t('doYouWantToDeleteThisVacancy')}</h1>

                        <p style={{paddingTop: 16}}>{t('itCannotBeUndone')}</p>

                        <Button size={'fill'} onClick={async () => {
                            await APIRequests.deleteVacancy(this.state.deletingVacancy)
                            this.getMyVacancies()
                            this.closeDeleteDialog()
                        }}>{t('delete')}</Button>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeDeleteDialog}/>
                    </div>
                </div>
            </Modal>
            <div className="flex justify-between responsive-content">
                <h1 className={'bigger inline-flex items-center'}>{t('myVacancies')}</h1>

                <Button iconLeft={'plus'} onClick={() => this.props.setView('vacancyview', '')}>
                    {t('addVacancy')}
                </Button>
            </div>

            <div className={css.vacancyList}>
                {this.state.vacancies.map((vac, i) =>
                    <div className={css.vacancyCard} bp={'grid'} key={i}>
                        <div bp={'12 6@md'}>
                            <div className={isMobile ? css.cardRoot : ''}>
                                <div className={css.cardRoot} style={{background: 'unset'}}>
                                    <Link href={'/vacancies/' + vac.slug}><ImageCarousel pics={[vac.pic]}
                                                                                         link={'/vacancies/' + vac.slug}
                                                                                         style={isMobile ? {} : {height: 'unset'}}
                                                                                         className={css.pic}/></Link>
                                </div>

                                <div className={css.cardRoot} style={{marginTop: 4}}>
                                    {isMobile
                                        ? <div className={css.content}>
                                            <p className={css.caption}>{vac.salonTitle}</p>
                                            <Link href={'/vacancies/' + vac.slug}><h2>{vac.title}</h2></Link>
                                            <p>{vac.description}</p>
                                        </div>
                                        : <div className={css.actionContainer}>
                                            <Button iconLeft={'edit'} onClick={() => this.props.setView('vacancyview', vac.slug)}>{t('edit')}</Button>
                                            <Button color={'thirdlayer'} onClick={() => {
                                                this.setState({
                                                    deletingVacancy: vac.slug,
                                                    deleteDialogOpen: true
                                                })
                                            }}>
                                                <Icon name={'trashcan_alt'} />
                                            </Button>
                                        </div>}
                                </div>
                            </div>
                        </div>
                        <div bp={'12 6@md'} className={cnb(css.cardRoot, css.vacancyInfo)}>
                            {!isMobile && <div className={css.content} style={{padding: 0, marginBottom: 12}}>
                                <p className={css.caption}>{vac.salonTitle}</p>
                                <Link href={'/vacancies/' + vac.slug}><h2>{vac.title}</h2></Link>
                                <p>{vac.description}</p>
                            </div>}

                            <div style={{marginBottom: 12}}
                                 className={'flex align-end justify-between non-selectable'}>
                                <span className={css.caption}>{t('salary')}</span>
                                <span
                                    className={css.value}>{t('from')} {formatPrice(vac.salary)} {t('kzt')}</span>
                            </div>
                            <div style={{marginBottom: 12}}
                                 className={'flex align-end justify-between non-selectable'}>
                                <span className={css.caption}>{t('schedule')}</span>
                                <span
                                    className={css.value}>{vac.workSchedule.map(i => t('schedule_' + i)).join(', ')}</span>
                            </div>
                            <div style={{marginBottom: 12}}
                                 className={'flex align-end justify-between non-selectable'}>
                                <span className={css.caption}>{t('employment')}</span>
                                <span
                                    className={css.value}>{vac.employment.map(i => t('employment_' + i)).join(', ')}</span>
                            </div>
                            <div className={'flex justify-between align-end non-selectable'}>
                                <span className={css.caption}>{t('city')}</span>
                                <span className={css.value}>{vac.region.name}</span>
                            </div>

                            {isMobile && <div className={css.actionContainer} style={{padding: '20px 0 0 0'}}>
                                <Button iconLeft={'edit'} onClick={() => this.props.setView('vacancyview', vac.slug)}>{t('edit')}</Button>
                                <Button color={'thirdlayer'} onClick={() => {
                                    this.setState({
                                        deletingVacancy: vac.slug,
                                        deleteDialogOpen: true
                                    })
                                }}>
                                    <Icon name={'trashcan_alt'} />
                                </Button>
                            </div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    }
}
