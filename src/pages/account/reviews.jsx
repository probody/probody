import React from "react"
import {withRouter} from "next/router"
import PersonalPageLayout from "../../layouts/secondary/PersonalPageLayout.jsx"
import {TITLE_POSTFIX} from "../../helpers/constants.js"
import Head from "next/head.js"
import {GlobalContext} from "../../contexts/Global.js"
import APIRequests from "../../helpers/APIRequests.js"
import css from '../../styles/pages/reviews.module.scss'
import ExtendedReviewBlock from "../../components/ExtendedReviewBlock";
import Icon from "../../components/kit/Icon.jsx";
import Modal from "../../components/kit/Modal.jsx";

class ReviewPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            reviews: [],
            successDialogOpen: false
        }

        this.onReviewAnswer = this.onReviewAnswer.bind(this)
        this.closeSuccessDialog = this.closeSuccessDialog.bind(this)
    }


    componentDidMount() {
        APIRequests.getReviewsByUser().then(res => {
            this.setState({
                reviews: res.reviews
            })
        })
    }

    onReviewAnswer(reviewId, dto) {
        if (!dto.answer.length) {
            return
        }

        APIRequests.answerReview(reviewId, dto).then(() => {
            APIRequests.getReviewsByUser().then(res => {
                this.setState({
                    reviews: res.reviews
                })
            })

            this.setState({
                successDialogOpen: true
            })
        })
    }

    closeSuccessDialog() {
        this.setState({
            successDialogOpen: false
        })
    }

    render() {
        const {t, theme, isMobile} = this.context

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{t('reviewsAndRating')}{TITLE_POSTFIX}</title>
            </Head>

            <Modal open={this.state.successDialogOpen} isMobile={false} desktopWidth={375}
                   onUpdate={this.closeSuccessDialog}>
                <div>
                    <div className={css.modalBody}>
                        <p>{t('cool')}</p>

                        <h1>{t('youAnsweredToReview')}</h1>

                        <p style={{paddingTop: 16}}>{t('itRaisesYourLoyality')}</p>

                        <Icon name={'close'} className={css.modalClose} onClick={this.closeSuccessDialog}/>
                    </div>
                </div>
            </Modal>

            <PersonalPageLayout page={'reviews'}>
                <div className="responsive-content">
                    <h1 className={css.salonReviews}>{t('reviews')} <span
                        className={css.reviewCnt}>{this.state.reviews.length}</span></h1>

                    <div bp={'grid 12 6@md'} style={{gap: isMobile ? 8 : 16}}>
                        {this.state.reviews.map((review, i) =>
                            <ExtendedReviewBlock onSubmit={this.onReviewAnswer} {...review} key={i}/>
                        )}
                    </div>
                </div>
            </PersonalPageLayout>
        </div>
    }
}

export default withRouter(ReviewPage)
