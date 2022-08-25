import React from "react"
import {withRouter} from "next/router"
import PersonalPageLayout from "../../layouts/secondary/PersonalPageLayout.jsx"
import {TITLE_POSTFIX} from "../../helpers/constants.js"
import Head from "next/head.js"
import css from '../../styles/statpage.module.scss'
import {GlobalContext} from "../../contexts/Global.js"
import {
    ArcElement,
    CategoryScale,
    Chart,
    LinearScale,
    LineController,
    LineElement,
    DoughnutController,
    PointElement, BarController, BarElement, Tooltip
} from 'chart.js'
import APIRequests from "../../helpers/APIRequests.js";
import {DateTime} from "luxon";
import {cnb} from "cnbuilder";

Chart.register(LineController, BarController, BarElement, DoughnutController, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const catColors = {
        views: '#3086F2',
        actions: '#88D23E',
        phone: '#73E2F1',
        map: '#8463E3',
        website: '#4D8FF1',
        messengers: '#FFE793',
        social: '#FAA526',
        price: '#FCCC21',
        photo: '#88D23E',
        review: '#FA6026',
        share: '#FF956D'
    },
    GRAPH_TENSION = 0.3,
    customLineTooltip = (context) => {
        // Tooltip Element
        const {chart, tooltip} = context;
        const getOrCreateTooltip = (chart) => {
            let tooltipEl = chart.canvas.parentNode.querySelector('div');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.classList.add(css.tooltipLine)
                tooltipEl.style.opacity = 1;

                const sectionRoot = document.createElement('div'),
                    section = document.createElement('section');

                sectionRoot.classList.add(css.tooltipContainer)
                section.classList.add(css.tooltip)

                sectionRoot.appendChild(section)

                tooltipEl.appendChild(sectionRoot);
                chart.canvas.parentNode.appendChild(tooltipEl);
            }

            return tooltipEl;
        };

        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        if (tooltip.body) {
            const titleLines = tooltip.title || [];

            const section = tooltipEl.querySelector('section');

            // Remove old children
            while (section.firstChild) {
                section.firstChild.remove();
            }

            // Add new children
            const text = document.createElement('p')

            text.innerText = titleLines[0]
            section.appendChild(text);
        }

        const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + 'px';
    },
    customTooltip = (context) => {
        // Tooltip Element
        const {chart, tooltip} = context;
        const getOrCreateTooltip = (chart) => {
            let tooltipEl = chart.canvas.parentNode.querySelector('div');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.classList.add(css.tooltipLine)
                tooltipEl.style.opacity = 1;
                tooltipEl.style.background = 'transparent';

                const sectionRoot = document.createElement('div'),
                    section = document.createElement('section');

                // sectionRoot.classList.add(css.tooltipContainer)
                section.classList.add(css.tooltip, css.withoutLine)

                sectionRoot.appendChild(section)

                tooltipEl.appendChild(sectionRoot);
                chart.canvas.parentNode.appendChild(tooltipEl);
            }

            return tooltipEl;
        };

        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        if (tooltip.body) {
            const titleLines = tooltip.title || [];

            const section = tooltipEl.querySelector('section');

            // Remove old children
            while (section.firstChild) {
                section.firstChild.remove();
            }

            // Add new children
            const text = document.createElement('p')

            text.innerText = titleLines[0]
            section.appendChild(text);
        }

        const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    },
    doughnutContent = (context) => {
        // Tooltip Element
        const {chart, tooltip} = context;
        const getOrCreateTooltip = (chart) => {
            let tooltipEl = chart.canvas.parentNode.querySelector('div');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');

                const section = document.createElement('section');

                tooltipEl.classList.add(css.doughnutContentContainer)
                section.classList.add(css.doughnutTooltip)

                tooltipEl.appendChild(section);
                chart.canvas.parentNode.appendChild(tooltipEl);
            }

            return tooltipEl;
        };

        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        const section = tooltipEl.querySelector('section');

        // Remove old children
        while (section.firstChild) {
            section.firstChild.remove();
        }

        // Add new children
        const textContainer = document.createElement('div'),
            percentage = document.createElement('div'),
            title = document.createElement('div')

        textContainer.style.textAlign = 'center'
        percentage.classList.add(css.percentageText)
        title.classList.add(css.captionTitle)

        percentage.innerText = Math.round(tooltip.dataPoints[0].raw / tooltip.dataPoints[0].dataset.data.reduce((acc, i) => acc + i, 0) * 100) + '%'
        title.innerText = tooltip.dataPoints[0].label

        textContainer.appendChild(percentage);
        textContainer.appendChild(title);
        section.appendChild(textContainer);

        const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = '29%'
        tooltipEl.style.top = '27%'
        // tooltipEl.style.left = (window.screen.width < 480 ? (window.screen.width - 280) : positionX + 95) + 'px';
        // tooltipEl.style.top = positionY + 95 + 'px';

    }

class StatsPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            statistics: {
                views: 0,
                phoneViews: 0,
                mapClicks: 0,
                websiteClicks: 0,
                socialClicks: 0,
                reviewClicks: 0,
                shareClicks: 0,
                messengerClicks: 0,
                photoViews: 0,
                priceViews: 0,
                sum: 0,
                actions: 0
            },
            charts: {
                viewsAndActions: {container: React.createRef(), chart: null},
                companyActions: {container: React.createRef(), chart: null},
                sectionClicks: {container: React.createRef(), chart: null},
                lastMonthActions: {container: React.createRef(), chart: null}
            },
        }
    }

    componentDidMount() {
        APIRequests.getStatsForNearestNDays(30).then(stats => {
            stats = stats.data

            if (this.state.charts.sectionClicks.chart ||
                this.state.charts.viewsAndActions.chart ||
                this.state.charts.companyActions.chart ||
                this.state.charts.lastMonthActions.chart) {
                return
            }

            const aggregatedStatistics = {
                    views: stats.reduce((acc, item) => acc + item.counters.views, 0),
                    phoneViews: stats.reduce((acc, item) => acc + item.counters.actions.phoneClicks, 0),
                    mapClicks: stats.reduce((acc, item) => acc + item.counters.actions.mapClicks, 0),
                    websiteClicks: stats.reduce((acc, item) => acc + item.counters.actions.websiteClicks, 0),
                    socialClicks: stats.reduce((acc, item) => acc + item.counters.actions.socialClicks, 0),
                    reviewClicks: stats.reduce((acc, item) => acc + item.counters.actions.reviewClicks, 0),
                    shareClicks: stats.reduce((acc, item) => acc + item.counters.actions.shareClicks, 0),
                    messengerClicks: stats.reduce((acc, item) => acc + item.counters.actions.messengerClicks, 0),
                    photoViews: stats.reduce((acc, item) => acc + item.counters.actions.photoClicks, 0),
                    priceViews: stats.reduce((acc, item) => acc + item.counters.actions.priceClicks, 0),
                },
                sum = Object.values(aggregatedStatistics).reduce((acc, item) => acc + item, 0)

            aggregatedStatistics.sum = sum
            aggregatedStatistics.actions = sum - aggregatedStatistics.views

            const labels = stats.map(i => DateTime.fromISO(i.date).toFormat('d.MM')),
                {t} = this.context

            this.setState({
                statistics: aggregatedStatistics,
                charts: {
                    viewsAndActions: {
                        ...this.state.charts.viewsAndActions,
                        chart: new Chart(this.state.charts.viewsAndActions.container.current.getContext('2d'), {
                            type: 'line',
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,

                                interaction: {
                                    intersect: false,
                                    mode: 'index',
                                },
                                plugins: {
                                    tooltip: {
                                        enabled: false,
                                        position: 'nearest',
                                        external: customLineTooltip
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            minRotation: 0,
                                            maxRotation: 0
                                        }
                                    }
                                }
                            },
                            data: {
                                labels,
                                datasets: [{
                                    label: t('pageViews'),
                                    data: stats.map(i => i.counters.views),
                                    fill: false,
                                    backgroundColor: catColors.views,
                                    borderColor: catColors.views,
                                    tension: GRAPH_TENSION
                                },
                                    {
                                        label: t('actionsOnPage'),
                                        data: stats.map(i => Object.values(i.counters.actions).reduce((acc, i) => acc + i, 0)),
                                        fill: false,
                                        backgroundColor: catColors.actions,
                                        borderColor: catColors.actions,
                                        tension: GRAPH_TENSION
                                    }]
                            }
                        })
                    },
                    companyActions: {
                        ...this.state.charts.companyActions,
                        chart: new Chart(this.state.charts.companyActions.container.current.getContext('2d'), {
                            type: 'bar',
                            data: {
                                labels,
                                datasets: [
                                    {
                                        label: t('callsAndPhoneViews'),
                                        data: stats.map(i => i.counters.actions.phoneClicks),
                                        backgroundColor: catColors.phone
                                    },
                                    {
                                        label: t('mapClicks'),
                                        data: stats.map(i => i.counters.actions.mapClicks),
                                        backgroundColor: catColors.map
                                    },
                                    {
                                        label: t('websiteClicks'),
                                        data: stats.map(i => i.counters.actions.websiteClicks),
                                        backgroundColor: catColors.website
                                    },
                                    {
                                        label: t('messengerClicks'),
                                        data: stats.map(i => i.counters.actions.messengerClicks),
                                        backgroundColor: catColors.messengers
                                    },
                                    {
                                        label: t('socialClicks'),
                                        data: stats.map(i => i.counters.actions.socialClicks),
                                        backgroundColor: catColors.social
                                    },
                                ]
                            },
                            options: {
                                scales: {
                                    x: {
                                        stacked: true,
                                        ticks: {
                                            minRotation: 0,
                                            maxRotation: 0
                                        }
                                    },
                                    y: {
                                        stacked: true
                                    }
                                },
                                plugins: {
                                    tooltip: {
                                        enabled: false,
                                        external: customTooltip
                                    }
                                },

                                interaction: {
                                    intersect: false,
                                    mode: 'nearest',
                                },
                                responsive: true,
                                maintainAspectRatio: false
                            }
                        })
                    },
                    sectionClicks: {
                        ...this.state.charts.sectionClicks,
                        chart: new Chart(this.state.charts.sectionClicks.container.current.getContext('2d'), {
                            type: 'line',
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,

                                interaction: {
                                    intersect: false,
                                    mode: 'index',
                                },

                                plugins: {
                                    tooltip: {
                                        enabled: false,
                                        position: 'nearest',
                                        external: customLineTooltip
                                    }
                                },

                                scales: {
                                    x: {
                                        ticks: {
                                            minRotation: 0,
                                            maxRotation: 0
                                        }
                                    }
                                }
                            },
                            data: {
                                labels,
                                datasets: [{
                                    label: t('priceViews'),
                                    data: stats.map(i => i.counters.actions.priceClicks),
                                    fill: false,
                                    borderColor: catColors.price,
                                    backgroundColor: catColors.price,
                                    tension: GRAPH_TENSION
                                },
                                    {
                                        label: t('photoViews'),
                                        data: stats.map(i => i.counters.actions.photoClicks),
                                        fill: false,
                                        borderColor: catColors.photo,
                                        backgroundColor: catColors.photo,
                                        tension: GRAPH_TENSION
                                    },
                                    {
                                        label: t('reviewClicks'),
                                        data: stats.map(i => i.counters.actions.reviewClicks),
                                        fill: false,
                                        borderColor: catColors.review,
                                        backgroundColor: catColors.review,
                                        tension: GRAPH_TENSION
                                    }]
                            }
                        })
                    },
                    lastMonthActions: {
                        ...this.state.charts.lastMonthActions,
                        chart: new Chart(this.state.charts.lastMonthActions.container.current.getContext('2d'), {
                            type: 'doughnut',
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '55%',

                                plugins: {
                                    tooltip: {
                                        enabled: false,
                                        external: doughnutContent
                                    }
                                }
                            },
                            data: {
                                labels: [
                                    t('reviewClicks'),
                                    t('mapClicks'),
                                    t('callsAndPhoneViews'),
                                    t('photoViews'),
                                    t('messengerClicks'),
                                    t('priceViews'),
                                    t('shareClicks'),
                                    t('socialClicks')
                                ],
                                datasets: [{
                                    data: [
                                        aggregatedStatistics.reviewClicks,
                                        aggregatedStatistics.mapClicks,
                                        aggregatedStatistics.phoneViews,
                                        aggregatedStatistics.photoViews,
                                        aggregatedStatistics.messengerClicks,
                                        aggregatedStatistics.priceViews,
                                        aggregatedStatistics.shareClicks,
                                        aggregatedStatistics.socialClicks
                                    ],
                                    backgroundColor: [catColors.review,
                                        catColors.map,
                                        catColors.phone,
                                        catColors.photo,
                                        catColors.messengers,
                                        catColors.price,
                                        catColors.share,
                                        catColors.social],
                                    borderWidth: 0
                                }]
                            }
                        })
                    }
                }
            })
        })
    }

    render() {
        const {t, theme} = this.context

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{t('stats')}{TITLE_POSTFIX}</title>
            </Head>

            <PersonalPageLayout page={'stats'}>
                <h1 className="bigger responsive-content">{t('stats')}</h1>

                <div className={css.slHeader} style={{marginTop: 16}}>{t('statViewsAndActions')}</div>

                <div bp={'grid'} className={css.chartContainer}>
                    <div bp="12 6@md">
                        <div className="flex column" style={{gap: 5}}>
                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.views}}>&nbsp;</span>
                                    <span>{t('pageViews')}</span>
                                </div>
                                <div>{this.state.statistics.views}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.actions}}>&nbsp;</span>
                                    <span>{t('actionsOnPage')}</span>
                                </div>
                                <div>{this.state.statistics.actions}</div>
                            </div>
                        </div>
                    </div>
                    <div bp="12 6@md" className={css.chart}>
                        <canvas ref={this.state.charts.viewsAndActions.container}></canvas>
                    </div>
                </div>

                <div className={css.slHeader}>{t('statCompanyActions')}</div>

                <div bp={'grid'} className={css.chartContainer}>
                    <div bp="12 6@md">
                        <div className="flex column" style={{gap: 5}}>
                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.phone}}>&nbsp;</span>
                                    <span>{t('callsAndPhoneViews')}</span>
                                </div>
                                <div>{this.state.statistics.phoneViews}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.map}}>&nbsp;</span>
                                    <span>{t('mapClicks')}</span>
                                </div>
                                <div>{this.state.statistics.mapClicks}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.website}}>&nbsp;</span>
                                    <span>{t('websiteClicks')}</span>
                                </div>
                                <div>{this.state.statistics.websiteClicks}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.messengers}}>&nbsp;</span>
                                    <span>{t('messengerClicks')}</span>
                                </div>
                                <div>{this.state.statistics.messengerClicks}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.social}}>&nbsp;</span>
                                    <span>{t('socialClicks')}</span>
                                </div>
                                <div>{this.state.statistics.socialClicks}</div>
                            </div>
                        </div>
                    </div>
                    <div bp="12 6@md" className={css.chart}>
                        <canvas ref={this.state.charts.companyActions.container}></canvas>
                    </div>
                </div>

                <div className={css.slHeader}>{t('statSectionClicks')}</div>

                <div bp={'grid'} className={css.chartContainer}>
                    <div bp="12 6@md">
                        <div className="flex column" style={{gap: 5}}>
                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.price}}>&nbsp;</span>
                                    <span>{t('priceViews')}</span>
                                </div>
                                <div>{this.state.statistics.priceViews}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.photo}}>&nbsp;</span>
                                    <span>{t('photoViews')}</span>
                                </div>
                                <div>{this.state.statistics.photoViews}</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.review}}>&nbsp;</span>
                                    <span>{t('reviewClicks')}</span>
                                </div>
                                <div>{this.state.statistics.reviewClicks}</div>
                            </div>
                        </div>
                    </div>
                    <div bp="12 6@md" className={css.chart}>
                        <canvas ref={this.state.charts.sectionClicks.container}></canvas>
                    </div>
                </div>

                <div className={css.slHeader}>{t('statActionsLastMonth')}</div>

                <div bp={'grid'} className={css.chartContainer}>
                    <div bp="12 6@md">
                        <div className="flex column" style={{gap: 5}}>
                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.review}}>&nbsp;</span>
                                    <span>{t('reviewClicks')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.reviewClicks / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.social}}>&nbsp;</span>
                                    <span>{t('socialClicks')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.socialClicks / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.price}}>&nbsp;</span>
                                    <span>{t('priceViews')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.priceViews / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.phone}}>&nbsp;</span>
                                    <span>{t('callsAndPhoneViews')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.phoneViews / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.messengers}}>&nbsp;</span>
                                    <span>{t('messengerClicks')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.messengerClicks / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.photo}}>&nbsp;</span>
                                    <span>{t('photoViews')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.photoViews / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.website}}>&nbsp;</span>
                                    <span>{t('websiteClicks')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.websiteClicks / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.share}}>&nbsp;</span>
                                    <span>{t('shareClicks')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.shareClicks / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>

                            <div className={css.legendItem}>
                                <div>
                                    <span style={{background: catColors.map}}>&nbsp;</span>
                                    <span>{t('mapClicks')}</span>
                                </div>
                                <div>{Math.round(this.state.statistics.mapClicks / Math.max(this.state.statistics.actions, 1) * 100)}%</div>
                            </div>
                        </div>
                    </div>
                    <div bp="12 6@md" className={cnb(css.chart, 'relative')} style={{height: 350}}>
                        <canvas ref={this.state.charts.lastMonthActions.container}></canvas>
                    </div>
                </div>
            </PersonalPageLayout>
        </div>
    }
}

export default withRouter(StatsPage)
