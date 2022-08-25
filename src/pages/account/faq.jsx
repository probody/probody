import React from "react"
import {withRouter} from "next/router"
import PersonalPageLayout from "../../layouts/secondary/PersonalPageLayout.jsx"
import {TITLE_POSTFIX} from "../../helpers/constants.js"
import Head from "next/head.js"
import {GlobalContext} from "../../contexts/Global.js"
import css from '../../styles/faq.page.module.scss'
import APIRequests from "../../helpers/APIRequests.js";
import PlusCollapsible from "../../components/kit/Collapses/PlusCollapsible";
import {cnb} from "cnbuilder";
import Button from "../../components/kit/Button.jsx";
import Icon from "../../components/kit/Icon.jsx";
import TextArea from "../../components/kit/Form/TextArea";

class FAQ extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            faq: [],
            offer: '',
            textAreaVisible: false
        }

        this.answerQuestion = this.answerQuestion.bind(this)
    }

    async componentDidMount() {
        let faq = await APIRequests.getFAQ()

        faq[0].quality = (await APIRequests.getFAQQuality(faq[0]._id)).quality * 100

        this.setState({
            faq
        })
    }

    async getQuality(index) {
        const faq = [...this.state.faq]

        if (faq[index].quality) {
            return
        }

        faq[index].quality = (await APIRequests.getFAQQuality(faq[index]._id)).quality * 100

        this.setState({
            faq
        })
    }

    async answerQuestion(index, useful, text) {
        if (!useful && this.state.offer.length < 3) {
            return
        }

        const faq = [...this.state.faq]

        APIRequests.answerQuestion(faq[index]._id, useful, text).then(() => {
            faq[index].gotResponse = true

            this.setState({faq, textAreaVisible: false})
        })
    }


    render() {
        const {t, theme} = this.context

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{t('faq')}{TITLE_POSTFIX}</title>
            </Head>

            <PersonalPageLayout page={'faq'}>
                <div>
                    <h1 style={{marginBottom: 32}} className={'bigger lack responsive-content'}>{t('needHelp')}</h1>

                    <div>
                        {this.state.faq.map((question, i) =>
                            <PlusCollapsible title={question.name} defaultOpen={i === 0} key={i} onOpen={() => this.getQuality(i)}>
                                <p className={'responsive-content'}>{question.description}</p>

                                {(question.gotResponse === false && !this.state.textAreaVisible) && <div style={{marginTop: 16, marginBottom: 12, maxWidth: 375}} className={cnb(css.cardRoot, css.padded)}>
                                    <h2>{t('wasThisAnswerUseful')}</h2>

                                    <p className={css.textDisabled}>
                                        {t('nUsersThinkThatsUseful', question.quality !== undefined ? question.quality.toFixed(0) : '-')}
                                    </p>

                                    <div className={css.buttonLine} style={{marginTop: 24}}>
                                        <Button onClick={() => this.answerQuestion(i, true)}>{t('yes')}</Button>
                                        <Button onClick={() => this.setState({textAreaVisible: true})} color={'tertiary'}>{t('no')}</Button>
                                        <a target={'_blank'} href={'https://t.me/nmish1995'}><Button color={'tertiary'}><Icon name={'tg_light'} /></Button></a>
                                    </div>
                                </div>}

                                {this.state.textAreaVisible && <div style={{marginTop: 16, marginBottom: 12, maxWidth: 500}} className={cnb(css.cardRoot, css.padded)}>
                                    <h2>{t('helpUsToImprove')}</h2>

                                    <TextArea className={css.bodyBg} label={t('offer')} placeholder={t('text')} value={this.state.offer} onUpdate={val => this.setState({offer: val})} max={100} min={3} />

                                    <div className={'flex'} style={{gap: 3}}>
                                        <Button onClick={() => this.answerQuestion(i, false, this.state.offer)}>{t('submit')}</Button>
                                        <Button onClick={() => this.setState({textAreaVisible: false})} color={'tertiary'}>{t('cancel')}</Button>
                                    </div>
                                </div>}
                            </PlusCollapsible>
                        )}
                    </div>
                </div>
            </PersonalPageLayout>
        </div>
    }
}

export default withRouter(FAQ)
