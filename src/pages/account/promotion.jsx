import React from "react"
import {TITLE_POSTFIX} from "../../helpers/constants.js"
import Head from "next/head.js"
import {GlobalContext} from "../../contexts/Global.js"
import PersonalPageLayout from "../../layouts/secondary/PersonalPageLayout.jsx"
import RaiseArchive from "../../components/promotion/RaiseArchive.jsx";
import Promotion from "../../components/promotion/Promotion.jsx";

class PromotionPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            view: 'main',
            setView: (view = undefined) => {
                this.setState({view}, () => {
                    window.scrollTo(0, 0)
                })
            }
        }
    }

    render() {
        const {t} = this.context

        return <>
            <Head>
                <title>{t('salonAndPromotion')}{TITLE_POSTFIX}</title>
            </Head>

            <PersonalPageLayout page={'promotion'}>
                {this.state.view === 'main' ? <Promotion setView={this.state.setView} /> : <RaiseArchive setView={this.state.setView} />}
            </PersonalPageLayout>
        </>
    }
}

export default PromotionPage
