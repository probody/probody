import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import ShareInSocialMedia from "../../components/ShareInSocialMedia";
import {withRouter} from "next/router.js";
import Paginator from "../../components/kit/Paginator";
import Objects from "../../helpers/Objects.js";
import css from "../../styles/articlecard.module.scss";
import Link from "next/link.js";
import Button from "../../components/kit/Button.jsx";
import {cnb} from "cnbuilder";
import {formatPrice} from "../../helpers/String.js";
import Head from "next/head.js";
import {TITLE_POSTFIX} from "../../helpers/constants.js";
import Breadcrumbs from "../../components/kit/Breadcrumbs.jsx";
import ImageCarousel from "../../components/kit/ImageCarousel";
import APIRequests from "../../helpers/APIRequests.js";

class BlogPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            vacancies: [],
            page: 1,
            pageCount: 1
        }

        this.initPageLoad = this.initPageLoad.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
    }

    componentDidMount() {
        this.initPageLoad()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.router.query.page !== this.props.router.query.page) {
            // window.document.body.scrollTo(0, 0)

            this.initPageLoad()
        }
    }

    handlePageChange(page) {
        if (page !== this.state.page
            && page > 0
            && page <= this.state.pageCount) {
            this.props.router.push({
                query: {
                    page
                }
            })
        }
    }

    async initPageLoad() {
        const vacResponse = await APIRequests.getVacancies(Number(this.props.router.query.page) || 1)

        this.setState({
            page: Number(this.props.router.query.page) || 1,
            vacancies: vacResponse.vacancies,
            pageCount: vacResponse.pageCount
        })
    }

    render() {
        const {t, isMobile, theme} = this.context

        return <section className={css['theme--' + theme]}>
            <Head>
                <title>{t('vacancies')}{TITLE_POSTFIX}</title>
            </Head>

            <Breadcrumbs items={[
                {
                    name: t('mainPage'),
                    href: '/',
                },
                {
                    name: t('vacancies'),
                    href: '/vacancies',
                }
            ]}/>

            <div className={'responsive-content'}>
                <p className={'additional-text'}>{t('gladToSeeYouHere')}</p>
                <h1 className={'text-xl'}>{t('welcomeToOurAnnouncementBoard')}</h1>
            </div>
            <div style={{marginTop: 32, gap: 8}} bp={'grid'}>
                <div bp={'12 8@md'}>
                    <div style={{marginBottom: 12}}>
                        {!Objects.isEmpty(this.state.vacancies) && this.state.vacancies.map((vac, index) =>
                            <div className={css.vacancyCard} bp={'grid'} key={index}>
                                <div bp={'12 6@md'}>
                                    <div className={isMobile ? css.cardRoot : ''}>
                                        <div className={css.cardRoot} style={{background: 'unset'}}>
                                            <Link href={'/vacancies/' + vac.slug}><ImageCarousel pics={[vac.pic]}
                                                                                                 link={'/vacancies/' + vac.slug}
                                                                                                 style={isMobile ? {} : {height: 'unset'}}
                                                                                                 className={css.pic}/></Link>
                                        </div>

                                        <div className={css.cardRoot}>
                                            {isMobile
                                                ? <div className={css.content}>
                                                    <p className={css.caption}>{vac.salonTitle}</p>
                                                    <Link href={'/vacancies/' + vac.slug}><h2>{vac.title}</h2></Link>
                                                    <p className={'keepFormat'}>{vac.description}</p>
                                                </div>
                                                : <div className={css.contactContainer}>
                                                    <Link href={'/vacancies/' + vac.slug}><Button>{t('detail')}</Button></Link>
                                                    <a href={'tel:' + vac.phone}><Button color={'tertiary'}
                                                                                         iconLeft={'call'}>
                                                        {t('call')}
                                                    </Button></a>
                                                </div>}
                                        </div>
                                    </div>
                                </div>
                                <div bp={'12 6@md'} className={cnb(css.cardRoot, css.vacancyInfo)}>
                                    {!isMobile && <div className={css.content} style={{padding: 0, marginBottom: 12}}>
                                        <p className={css.caption}>{vac.salonTitle}</p>
                                        <Link href={'/vacancies/' + vac.slug}><h2>{vac.title}</h2></Link>
                                        <p className={'keepFormat'}>{vac.description}</p>
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

                                    {isMobile && <div className={cnb(css.contactContainer, css.mobile)}>
                                        <Link href={'/vacancies/' + vac.slug}><Button>{t('detail')}</Button></Link>
                                        <a href={'tel:' + vac.phone}><Button color={'tertiary'} iconLeft={'call'}>
                                            {t('call')}
                                        </Button></a>
                                    </div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div bp={'12 4@md'}>
                    {(this.state.pageCount > 1 && isMobile) &&
                        <Paginator page={this.state.page} onChange={this.handlePageChange}
                                   pageCnt={this.state.pageCount} style={{marginBottom: 16}}/>}

                    <ShareInSocialMedia url={'https://probody.kz'}/>
                </div>
            </div>

            {(this.state.pageCount > 1 && !isMobile) &&
                <Paginator page={this.state.page} onChange={this.handlePageChange}
                           pageCnt={this.state.pageCount}/>}
        </section>
    }
}

export default withRouter(BlogPage);
