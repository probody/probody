import React from "react";
import TextSection from "./kit/TextSection";
import {GlobalContext} from "../contexts/Global.js";
import StatsInfoBlock from "./kit/StatsInfoBlock.jsx";
import css from '../styles/about-us.module.scss';
import ShareInSocialMedia from "./ShareInSocialMedia.jsx";
import APIRequests from "../helpers/APIRequests.js";

export default class AboutUsSection extends React.Component {
    static contextType = GlobalContext;

    constructor(props) {
        super(props);

        this.state = {
            avg: 0,
            reviewCnt: 0,
            ratingCnt: 0
        }
    }


    componentDidMount() {
        APIRequests.getReviewStats().then(reviews => {
            this.setState({
                avg: reviews.avg[0].avg,
                ratingCnt: reviews.ratingCnt,
                reviewCnt: reviews.reviewCnt
            })
        })
    }

    render() {
        const {t, isMobile, theme} = this.context;

        return <div className={css['theme--' + theme]}>
            <section className={'container'} bp={'grid'} style={{gap: isMobile ? 32 : 20}}>
                <div bp={'12 8@md'}>
                    <TextSection dangerouslySetInnerHTML={{__html: t('seoText1')}} style={{marginBottom: isMobile ? 32 : 8}}>
                    </TextSection>

                    {isMobile && <div style={{marginBottom: isMobile ? 32 : 8}}>
                        <StatsInfoBlock title={t('siteStatsTitle')} stats={[
                            {
                                title: t('avgRating'),
                                value: this.state.avg.toFixed(1),
                                accent: true
                            },
                            {
                                title: t('totalRatings'),
                                value: this.state.ratingCnt
                            },
                            {
                                title: t('totalReviews'),
                                value: this.state.reviewCnt
                            }
                        ]}/>
                    </div>}

                    <TextSection dangerouslySetInnerHTML={{__html: t('seoText2')}}>
                    </TextSection>
                </div>
                <div bp={'first@md 12 4@md'}>
                    {!isMobile && <div style={{marginBottom: isMobile ? 32 : 8}}>
                        <StatsInfoBlock title={t('siteStatsTitle')} stats={[
                            {
                                title: t('avgRating'),
                                value: this.state.avg.toFixed(1),
                                accent: theme === 'light'
                            },
                            {
                                title: t('totalRatings'),
                                value: this.state.ratingCnt
                            },
                            {
                                title: t('totalReviews'),
                                value: this.state.reviewCnt
                            }
                        ]}/>
                    </div>}
                    <ShareInSocialMedia url={'https://probody.kz'} />
                </div>
            </section>
        </div>
    }
}
