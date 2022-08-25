import React from "react"
import {withRouter} from "next/router.js"
import {GlobalContext} from "../contexts/Global.js"
import AboutUsSection from "../components/AboutUsSection.jsx"
import {TITLE_POSTFIX, YANDEX_APIKEY} from "../helpers/constants.js"
import Head from "next/head.js"
import css from '../styles/mainpage.module.scss'
import APIRequests from "../helpers/APIRequests.js"
import RadioGroup from "../components/kit/Form/RadioGroup"
import ImageCarousel from "../components/kit/ImageCarousel"
import {cnb} from "cnbuilder"
import Icon from "../components/kit/Icon.jsx"
import Link from "next/link.js"
import Paginator from "../components/kit/Paginator.jsx"
import Button from "../components/kit/Button.jsx"
import Objects from "../helpers/Objects.js"
import Popup from "../components/kit/Popup"
import Numbers from "../helpers/Numbers.js"
import ControlledInput from "../components/kit/Form/ControlledInput.jsx"
import {parsePhoneNumber} from "libphonenumber-js"
import ProgramCard from "../components/kit/ProgramCard"
import MockProgramCard from "../components/kit/MockProgramCard.jsx"
import ParameterView from "../components/kit/ParameterView.jsx"
import ShortMasterCard from "../components/kit/ShortMasterCard"
import MockShortMasterCard from "../components/kit/MockShortMasterCard"
import Checkbox from "../components/kit/Form/Checkbox.jsx"
import TransparentCollapsible from "../components/kit/Collapses/TransparentCollapsible.jsx"
import MultipleRangeInput from "../components/kit/Form/MultipleRangeInput"
import debounce from "../helpers/debounce"
import Select from "../components/kit/Form/Select.jsx"
import {declination} from "../helpers/String.js"
import UserHelper from "../helpers/UserHelper.js";
import PlaceMark from '../helpers/PlaceMark.js'
import Script from "next/script.js";

class Home extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            workers: [],
            filters: {},
            kind: 'all',
            handleRef: React.createRef(),
            filterPopupOpen: false,
            preventLoading: false,
            map: undefined,
            isMapView: false,
            workerLocations: {},
            chosenSalonId: '',
            preloadedSalons: {},
            appliedFilters: {
                services: [],
                leads: [],
                messengers: [],
                rooms: [],
                price: {}
            },

            pageCount: 1,
            foundCnt: 0,
            regions: [],
            myRegion: '',
            priceRange: {
                from: 1000,
                to: 99999
            },
            inputId: 'text-input-' + Numbers.random(0, 99999),
            selectId: 'select-' + Numbers.random(0, 99999),
        }

        this.initPageLoad = this.initPageLoad.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.performSearch = debounce(this.performSearch.bind(this), 500)
        this.toggleFilterPopup = this.toggleFilterPopup.bind(this)
        this.getPage = this.getPage.bind(this)
        this.resetFilters = this.resetFilters.bind(this)
        this.toggleFilter = this.toggleFilter.bind(this)
        this.setPriceRange = this.setPriceRange.bind(this)
        this.setRegion = this.setRegion.bind(this)
        this.loadMore = this.loadMore.bind(this)
        this.addMapObjects = this.addMapObjects.bind(this)
        this.searchNearMe = this.searchNearMe.bind(this)
        this.getShortSalonInfo = this.getShortSalonInfo.bind(this)
        this.initRegionSelect = this.initRegionSelect.bind(this)
        this.viewSalonOnTheMap = this.viewSalonOnTheMap.bind(this)
    }

    async initPageLoad(volatile = false) {
        if (Objects.isEmpty(this.state.filters)) {
            APIRequests.getFilters().then(filters => {
                this.setState({
                    filters,
                    priceRange: filters.priceRange
                })
            })
        }

        this.performSearch(volatile)
    }

    componentDidMount() {
        if (this.props.router.query.onTheMap) {
            this.viewSalonOnTheMap(this.props.router.query.onTheMap)
        }

        this.initPageLoad()
        this.initRegionSelect()
    }

    toggleFilterPopup() {
        if (this.state.filterPopupOpen) {
            this.performSearch()
        }

        this.setState({
            filterPopupOpen: !this.state.filterPopupOpen
        })
    }

    getPage() {
        return parseInt(this.props.router.query.page) || 1
    }

    performSearch(appendResults = false, onlyCount = false) {
        APIRequests.searchWorkers(this.state.isMapView ? 1 : this.getPage(), this.context.query.trim(), {
            kind: this.state.kind,
            rooms: this.state.appliedFilters.rooms.map(i => this.state.filters.rooms.find(room => room._id === i)?.name).join(' '),
            messengers: this.state.appliedFilters.messengers.map(i => this.state.filters.messengers.find(messenger => messenger._id === i)?.name).join(' '),
            services: this.state.appliedFilters.services.map(i => this.state.filters.services.find(service => service._id === i)?.name).join(' '),
            leads: this.state.appliedFilters.leads.map(i => this.state.filters.leads.find(lead => lead._id === i)?.name).join(' '),

            price: this.state.appliedFilters.price,
            region: UserHelper.currentRegion()?.name
        }, onlyCount).then(workers => {
            if (onlyCount) {
                return this.setState({
                    foundCnt: workers.count
                })
            }

            if (!workers.results) {
                return
            }

            workers.reviews.map(review => {
                workers.results[workers.results.findIndex(worker => worker._id === review._id)].reviews = review
            })

            if (appendResults) {
                workers.results.unshift(...this.state.workers)
            }

            this.setState({
                pageCount: workers.pageCount,
                workers: workers.results,
                foundCnt: workers.count,
                workerLocations: workers.workerLocations
            });

            let center

            if (workers.results[0]) {
                center = workers.results[0].location.coordinates
            } else {
                center = UserHelper.currentRegion()?.center
            }

            const initMap = () => {
                if (this.state.map) {
                    return
                }

                const map = new window.ymaps.Map('mapView', {
                    center,
                    zoom: 14,
                    controls: []
                }, {})

                this.addMapObjects(workers.workerLocations, map, center)

                this.setState({
                    map
                })
            }

            if (!this.state.map) {
                window.ymaps.ready(initMap.bind(this))
            } else {
                this.addMapObjects(workers.workerLocations, undefined, center)
            }
        })
    }

    addMapObjects(workers, map, center) {
        if (!map) {
            map = this.state.map
        }

        map.geoObjects.removeAll()

        const clusterer = new ymaps.Clusterer({
                groupByCoordinates: false,
                clusterIcons: [{
                    href: '/icons/cluster.svg',
                    size: [40, 40],
                    offset: [-20, -20]
                }],
                clusterNumbers: [1000]
                // clusterHideIconOnBalloonOpen: false,
                // geoObjectHideIconOnBalloonOpen: false
            }),
            geoObjects = []

        for (const id in workers) {
            let pm = new window.ymaps.Placemark(workers[id], {}, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: '/icons/dot.svg',
                iconImageSize: [24, 24],
                iconImageOffset: [-5, -5],
                iconContentOffset: [0, -25]
            })

            pm.options.set('salonId', id)

            pm.events.add('mouseenter', async () => {
                if (map.state.get('hasFocus')) {
                    return
                }

                PlaceMark(pm).open(this.context.t, this.getShortSalonInfo(id))
            })

            pm.events.add('click', () => {
                if (map.state.get('hasFocus')) {
                    map.geoObjects.get(0).getGeoObjects().forEach(pm => PlaceMark(pm).close())
                    PlaceMark(pm).open(this.context.t, this.getShortSalonInfo(id))
                } else {
                    map.state.set('hasFocus', true)
                }

                this.chooseSalonOnMap(id)
            })

            pm.events.add('mouseleave', () => {
                if (map.state.get('hasFocus')) {
                    return
                }

                PlaceMark(pm).close()
            })

            geoObjects.push(pm)
        }

        clusterer.add(geoObjects)

        map.geoObjects.add(clusterer)
        map.setCenter(center, 13)

        map.events.add('click', () => {
            map.geoObjects.get(0).getGeoObjects().forEach(pm => PlaceMark(pm).close())
            map.state.set('hasFocus', false)

            this.setState({
                chosenSalonId: ''
            })
        })
    }

    chooseSalonOnMap(salonId) {
        // PlaceMark(this.state.map.geoObjects.get(0).getGeoObjects().find(i => i.options.get('salonId') === salonId)).setActive()

        if (this.state.preloadedSalons[salonId]) {
            return this.setState({
                chosenSalonId: salonId
            })
        }

        this.state.map.panTo(this.state.workerLocations[salonId])

        APIRequests.getMapWorker(salonId).then(salon => {
            this.setState({
                preloadedSalons: {
                    ...this.state.preloadedSalons,
                    [salonId]: salon
                },
                chosenSalonId: salonId
            })
        })
    }

    UNSAFE_componentWillReceiveProps() {
        this.initRegionSelect()
    }

    handlePageChange(page) {
        if (page !== this.getPage()
            && page > 0
            && page <= this.state.pageCount) {
            this.props.router.push({
                query: Object.assign({}, this.props.router.query, {
                    page
                })
            })
        }
    }

    async getShortSalonInfo(id) {
        if (this.state.preloadedSalons[id]) {
            return this.state.preloadedSalons[id]
        }

        const salon = await APIRequests.getMapWorker(id)

        this.setState({
            preloadedSalons: {
                ...this.state.preloadedSalons,
                [id]: salon
            }
        })

        return salon
    }

    resetFilters() {
        this.setState({
            appliedFilters: {
                services: [],
                leads: [],
                messengers: [],
                rooms: [],
                price: {}
            }
        }, () => this.performSearch(false, true))
    }

    toggleFilter(scope, name) {
        let filterData = [...this.state.appliedFilters[scope]]

        if (filterData.includes(name)) {
            filterData = filterData.filter(i => i !== name)
        } else {
            filterData.push(name)
        }

        this.setState({
            appliedFilters: {
                ...this.state.appliedFilters,
                [scope]: filterData
            }
        }, () => this.performSearch(false, true))
    }

    setPriceRange(from, to) {
        if (from && from > this.state.appliedFilters.price.to) {
            to = from
        } else if (to && to < this.state.appliedFilters.price.from) {
            from = to
        }

        const priceRange = {...this.state.appliedFilters.price}

        if (from) {
            priceRange.from = from
        }

        if (to) {
            priceRange.to = to
        }

        this.setState({
            appliedFilters: {
                ...this.state.appliedFilters,
                price: priceRange
            }
        }, () => this.performSearch(false, true))
    }

    setRegion(region) {
        this.setState({
            myRegion: region
        })

        UserHelper.setRegion(region)

        this.initPageLoad()
    }

    async searchNearMe() {
        try {
            const usersLocation = (await window.ymaps.geolocation.get()).geoObjects.position,
                circle = new ymaps.Circle([
                    usersLocation,
                    5000
                ], {}, {
                    fillColor: "#ffc83a40",
                    strokeColor: "#ffc83ad1",
                    strokeWidth: 3,
                    cursor: 'default'
                })

            if (this.state.map.state.get('locationCircleAdded')) {
                this.state.map.panTo(usersLocation, {
                    checkZoomRange: true
                })
            } else {
                this.state.map.geoObjects.add(circle)
                this.state.map.state.set('locationCircleAdded', true)
                this.state.map.setBounds(circle.geometry.getBounds())
            }
        } catch (e) {
            console.log(e)
        }
    }

    initRegionSelect() {
        if (this.state.regions.length) {
            return
        }

        const regions = UserHelper.regions(),
            myRegion = UserHelper.currentRegion()?.name

        if (regions) {
            this.setState({
                regions: regions.map(r => ({_id: r.name, name: r.name})),
                myRegion
            })
        }
    }

    viewSalonOnTheMap(salonId) {
        APIRequests.incrementStats(salonId, 'mapClicks')
        window.document.body.scrollTo(0, 0)

        APIRequests.getMapWorker(salonId).then(salon => {
            this.setState({
                preloadedSalons: {
                    ...this.state.preloadedSalons,
                    [salonId]: salon
                },
                chosenSalonId: salonId,
                isMapView: true
            }, () => {
                this.props.router.push({query: {}})

                const modifyMap = () => {
                    PlaceMark(this.state.map.geoObjects.get(0).getGeoObjects().find(i => i.options.get('salonId') === salonId)).open(this.context.t, new Promise(resolve => resolve(salon)))
                    this.state.map.setCenter(salon.worker.location.coordinates, 15)
                    this.state.map.state.set('hasFocus', true)
                }

                if (this.state.map) {
                    modifyMap()
                } else {
                    window.ymaps.ready(() => setTimeout(modifyMap, 500))
                }
            })
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.router.query.onTheMap && this.props.router.query.onTheMap !== prevProps.router.query.onTheMap) {
            this.viewSalonOnTheMap(this.props.router.query.onTheMap)
        }

        if (this.lastQuery !== this.context.query) {
            this.performSearch()

            if (this.context.query === ' ') {
                return this.context.setQuery('')
            }
        }

        if (this.props.router.query.page !== prevProps.router.query.page && !this.state.preventLoading) {
            this.performSearch()
        }

        this.lastQuery = this.context.query
    }

    loadMore() {
        this.setState({
            preventLoading: true
        }, async () => {
            this.props.router.push({query: {page: (Number(this.props.router.query.page) || 1) + 1}}, undefined, {shallow: true})

            await this.performSearch(true)

            setTimeout(() => {
                this.setState({
                    preventLoading: false
                })
            }, 1000)
        })
    }

    lastQuery = ''

    render() {
        const {t, theme, isMobile, query, setQuery} = this.context
        const {inputId, selectId} = this.state

        return (
            <div className={css['theme--' + theme]}>
                <Head>
                    <title>{t('mainPage')}{TITLE_POSTFIX}</title>
                </Head>

                <Script src={'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=' + YANDEX_APIKEY}
                        strategy={'beforeInteractive'}/>

                {!(this.state.isMapView && isMobile) &&
                    <div className="responsive-content">
                        <p className="subtitle additional-text non-selectable">{t('greet')}</p>
                        <h1 className={'text-xl'}>{t('qWhatToFindForYou')}</h1>

                        <br className={'non-selectable'}/>
                    </div>}

                <div bp={'grid'} style={{gap: 8, marginBottom: 16}}>
                    <div bp={'12 4@md'} className={'responsive-content'}>
                        <RadioGroup containerClass={css.kindContainer} className={css.kindSelector} name={''}
                                    value={this.state.kind}
                                    checkedClassName={css.radioChecked}
                                    onUpdate={kind => {
                                        this.setState({kind}, () => this.performSearch())
                                    }} options={[
                            {
                                label: t('all'),
                                value: 'all'
                            },
                            {
                                label: t('salons'),
                                value: 'salon'
                            },
                            {
                                label: isMobile ? t('masters') : t('privateMasters'),
                                value: 'master'
                            }
                        ]}/>
                    </div>
                    <div bp={'12 8@md'} className={'responsive-content'}>
                        <div className="flex fit justify-end">
                            <div
                                bp={'hide ' + (this.state.isMapView ? 'show' : 'hide') + '@md'}>
                                <Button className={css.searchNearMeBtn}
                                        onClick={this.searchNearMe}>{t('searchNearMe')}</Button>
                            </div>

                            <div className={css.switchRoot}>
                                <div
                                    className={!this.state.isMapView ? css.active : ''}
                                    onClick={() => this.setState({isMapView: false})}>{isMobile ? t('listMobile') : t('list')}</div>
                                <div
                                    className={this.state.isMapView ? css.active : ''}
                                    onClick={() => this.setState({isMapView: true})}>{isMobile ? t('map') : t('mapPC')}</div>
                            </div>

                            <div ref={this.state.handleRef}>
                                <Button className={css.filterButton} color={'secondary'}
                                        onClick={this.toggleFilterPopup}>
                                    <span
                                        className={css.cnt}>{Object.values(this.state.appliedFilters).reduce((acc, i) => {
                                        if (Array.isArray(i)) {
                                            if (i.length > 0) {
                                                return ++acc
                                            } else {
                                                return acc
                                            }
                                        }

                                        if (i.from || i.to) {
                                            return ++acc
                                        } else {
                                            return acc
                                        }
                                    }, 0)}</span>
                                    {!isMobile &&
                                        <span style={{margin: '0 4px', verticalAlign: 'inherit'}}>{t('filter')}</span>}
                                    <Icon name={'filter'}/>
                                </Button>
                                <Popup handleRef={this.state.handleRef}
                                       style={isMobile ? {
                                           top: 0,
                                           height: '100%',
                                           padding: 0,
                                           overflowX: 'hidden'
                                       } : {
                                           right: 0,
                                           top: 4,
                                           padding: '24px 32px 32px 32px'
                                       }}
                                       onClose={() => this.setState({filterPopupOpen: false})}
                                       isOpen={this.state.filterPopupOpen} fullSize={isMobile}>
                                    <div className="fit">
                                        <div bp={'grid 12 4@md'} className={css.filterContainer}>
                                            <div bp={'hide@md'} className={cnb(css.modalHead, css.mobile)}>
                                                <div className={css.resetBtn} style={{marginRight: -24}}
                                                     onClick={this.resetFilters}>{t('discard')}</div>

                                                <h2>{t('filter')}</h2>

                                                <Icon name={'close'} onClick={this.toggleFilterPopup}/>
                                            </div>

                                            <div>
                                                {isMobile && <div className={css.padded}>
                                                    <div className={cnb(css.inputGroup, 'flex')} style={{width: '100%'}}
                                                         onClick={() => window.document.getElementById(selectId).click()}>
                                                        <Icon name={'geo'}/>
                                                        {(this.state.regions.length && this.state.filterPopupOpen) &&
                                                            <Select className={css.customSelect} style={{width: '100%'}}
                                                                    label={''} fill
                                                                    options={this.state.regions} id={selectId}
                                                                    placeholder={t('selectRegion')}
                                                                    value={this.state.myRegion}
                                                                    onUpdate={val => this.setRegion(val)}/>}
                                                        <div onClick={() => this.setRegion('Алматы')}><Icon
                                                            name={'close'}/></div>
                                                    </div>
                                                </div>}

                                                <div bp={'hide@md'}>
                                                    <TransparentCollapsible title={t('hourPrice')}
                                                                            defaultOpen={!isMobile}
                                                                            lock={!isMobile}>
                                                        <div className={css.collapseBody}>
                                                            <MultipleRangeInput step={50} accent={true}
                                                                                from={this.state.appliedFilters.price.from || this.state.priceRange.from}
                                                                                to={this.state.appliedFilters.price.to || this.state.priceRange.to}
                                                                                min={this.state.priceRange.from}
                                                                                max={this.state.priceRange.to}
                                                                                onUpdate={this.setPriceRange}/>
                                                        </div>
                                                    </TransparentCollapsible>
                                                </div>

                                                <TransparentCollapsible title={t('services')} defaultOpen={true}
                                                                        lock={!isMobile}>
                                                    <div className={css.collapseBody}>
                                                        {this.state.filters.leads?.map(lead =>
                                                            <Checkbox style={{marginBottom: 8}} key={lead._id}
                                                                      name={lead.name}
                                                                      icon={lead.icon}
                                                                      value={this.state.appliedFilters.leads.includes(lead._id)}
                                                                      onUpdate={() => this.toggleFilter('leads', lead._id)}/>
                                                        )}
                                                        {this.state.filters.services?.map(service =>
                                                            <Checkbox style={{marginBottom: 8}} key={service._id}
                                                                      name={service.name} icon={service.icon}
                                                                      value={this.state.appliedFilters.services.includes(service._id)}
                                                                      onUpdate={() => this.toggleFilter('services', service._id)}/>
                                                        )}
                                                    </div>
                                                </TransparentCollapsible>
                                            </div>
                                            <div>
                                                <TransparentCollapsible title={t('messengers')} defaultOpen={!isMobile}
                                                                        lock={!isMobile}>
                                                    <div className={css.collapseBody}>
                                                        {this.state.filters.messengers?.map(messenger =>
                                                            <Checkbox style={{marginBottom: 8}} key={messenger._id}
                                                                      name={messenger.name} icon={messenger.icon}
                                                                      value={this.state.appliedFilters.messengers.includes(messenger._id)}
                                                                      onUpdate={() => this.toggleFilter('messengers', messenger._id)}/>
                                                        )}
                                                    </div>
                                                </TransparentCollapsible>

                                                <TransparentCollapsible title={t('roomCnt')} defaultOpen={!isMobile}
                                                                        lock={!isMobile}>
                                                    <div className={css.collapseBody}>
                                                        {this.state.filters.rooms?.map(room =>
                                                            <Checkbox style={{marginBottom: 8}} key={room._id}
                                                                      name={room.name}
                                                                      value={this.state.appliedFilters.rooms.includes(room._id)}
                                                                      onUpdate={() => this.toggleFilter('rooms', room._id)}/>
                                                        )}
                                                    </div>
                                                </TransparentCollapsible>
                                            </div>
                                            <div bp={'hide show@md'} className={css.verticalBetween}>
                                                <TransparentCollapsible title={t('hourPrice')} defaultOpen={!isMobile}
                                                                        lock={!isMobile}>
                                                    <MultipleRangeInput step={50} accent={true}
                                                                        from={this.state.appliedFilters.price.from || this.state.priceRange.from}
                                                                        to={this.state.appliedFilters.price.to || this.state.priceRange.to}
                                                                        min={this.state.priceRange.from}
                                                                        max={this.state.priceRange.to}
                                                                        onUpdate={this.setPriceRange}/>
                                                </TransparentCollapsible>

                                                <div className={css.fullSizeBtn}>
                                                    <Button style={{marginBottom: 8}}
                                                            onClick={this.toggleFilterPopup}>{t('seeNVariants', this.state.foundCnt)}</Button>

                                                    <span className={css.resetBtn}
                                                          onClick={this.resetFilters}>{t('discard')}</span>
                                                </div>
                                            </div>

                                            {isMobile && <div className={cnb(css.bottomSection, css.stickToBottom)}>
                                                <div className={css.fullSizeBtn}>
                                                    <Button style={{marginBottom: 8}}
                                                            onClick={this.toggleFilterPopup}>{t('seeNVariants', this.state.foundCnt)}</Button>
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                </Popup>
                            </div>
                        </div>
                    </div>

                    <div bp={'12 hide@md'} className={'responsive-content'}>
                        <label htmlFor={inputId} bp={'fill flex'} className={css.inputGroup}>
                            <Icon name={'search'}/>
                            <ControlledInput id={inputId} bp={'fill'} type="text"
                                             value={query}
                                             onChange={e => setQuery(e.target.value)}
                                             placeholder={t('ssm')}/>
                            <div onClick={() => setQuery('')}><Icon name={'close'}/></div>
                        </label>
                    </div>
                </div>

                <div bp={'grid'} style={{marginBottom: 24}}>
                    <div
                        bp={cnb('12', this.state.isMapView ? '' : 'hide')}
                        className={css.mapContainer}>

                        {(() => {
                            const chosenSalon = this.state.preloadedSalons[this.state.chosenSalonId]

                            return chosenSalon && <section className={css.chosenSalon}>
                                <div bp={'hide show@md'}>
                                    <ImageCarousel link={'/salon/' + chosenSalon.worker.slug} isPRO={+new Date(chosenSalon.worker.host.subscriptionTo) > +new Date}
                                                   pics={chosenSalon.worker.photos} height={240}/>
                                </div>
                                <div className={css.content}>
                                    <div className="flex justify-between">
                                        <div>
                                            {chosenSalon.worker.isVerified &&
                                                <div className={cnb(css.caption, 'non-selectable')}>
                                                    <Icon name={'round_check'} className={css.verifiedIcon}/>

                                                    <span>{t('verified')}</span>
                                                </div>}

                                            <Link href={'/salon/' + chosenSalon.worker.slug}><p className="subtitle2">{chosenSalon.worker.name}</p></Link>

                                            <p style={{marginTop: 16}}>{chosenSalon.worker.address}</p>

                                            <div className={css.reviewSection}>
                                                <div>
                                                    <Icon name={'star'}/>
                                                    <span>{(chosenSalon.review[0]?.avg || 0).toFixed(1)}</span>
                                                </div>

                                                <div>
                                                    {(chosenSalon.review[0]?.count || 0)} {declination((chosenSalon.review[0]?.count || 0), t('reviewDeclination'))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Icon name={'close'} className={css.closeIcon}
                                                  onClick={() => {
                                                      this.state.map.state.set('hasFocus', false)

                                                      this.state.map.geoObjects.get(0).getGeoObjects().forEach(pm => PlaceMark(pm).close())

                                                      this.setState({
                                                          chosenSalonId: ''
                                                      })
                                                  }}/>
                                        </div>
                                    </div>

                                    <div className={css.buttonLayout}>
                                        <div><a href={'tel:' + parsePhoneNumber(chosenSalon.worker.phone).number} onClick={() => APIRequests.incrementStats(chosenSalon.worker._id, 'phoneClicks')}>
                                            <Button><Icon name={'call'}/></Button>
                                        </a></div>
                                        <div><a target="_blank" onClick={() => APIRequests.incrementStats(chosenSalon.worker._id, 'messengerClicks')}
                                                href={'https://wa.me/' + parsePhoneNumber(chosenSalon.worker.messengers.wa).number.replace('+', '') + '?text=' + encodeURIComponent(t('salonAnswerPrefill') + ' "' + chosenSalon.worker.name + '"')}>
                                            <Button color={'tertiary'}>
                                                <Icon name={'wa_light'}/>
                                            </Button>
                                        </a></div>
                                        {chosenSalon.worker.messengers.tg && <div><a target="_blank" onClick={() => APIRequests.incrementStats(chosenSalon.worker._id, 'messengerClicks')}
                                                                                     href={'https://t.me/' + chosenSalon.worker.messengers.tg.replace('@', '')}>
                                            <Button color={'tertiary'}>
                                                <Icon name={'tg_light'}/>
                                            </Button>
                                        </a></div>}
                                        <Link href={'/salon/' + chosenSalon.worker.slug}>
                                            <Button color={'tertiary'}>{t('open')}</Button>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        })()}

                        <div id={'mapView'} className={css.mapView}></div>
                    </div>
                    {!this.state.isMapView && this.state.workers.map((worker, index) => {
                        worker.url = '/salon/' + worker.slug

                        return <div bp={'12'} key={index}>
                            <div bp={'grid'} className={css.workerBlock}>
                                <div bp={'12 5@md'}>
                                    <div className={css.cardRoot}>
                                        <ImageCarousel link={worker.url} pics={worker.photos} isPRO={+new Date(worker.host[0].subscriptionTo) > +new Date} />

                                        {isMobile ? <div className={css.padded}>
                                            {worker.isVerified && <div className={cnb(css.caption, 'non-selectable')}>
                                                <Icon name={'round_check'} className={css.verifiedIcon}/>

                                                <span>{t('verified')}</span>
                                            </div>}

                                            <Link href={worker.url}><h1 className={'cursor-pointer'}>{worker.name}</h1>
                                            </Link>
                                        </div> : <div className={css.padded}>
                                            <p className="subtitle2" style={{marginBottom: 12}}>
                                                {t('description')}
                                            </p>
                                            <p className={cnb(css.ellipsis, css.helperText)}>{worker.description}</p>

                                            <div className={css.stretchContainer}>
                                                <Link href={worker.url}>
                                                    <Button>{t('detail')}</Button>
                                                </Link>
                                                <div><a href={'tel:' + parsePhoneNumber(worker.phone).number} onClick={() => APIRequests.incrementStats(worker._id, 'phoneClicks')}>
                                                    <Button><Icon name={'call'}/></Button>
                                                </a></div>
                                                <div><a target="_blank" onClick={() => APIRequests.incrementStats(worker._id, 'messengerClicks')}
                                                        href={'https://wa.me/' + parsePhoneNumber(worker.messengers.wa).number.replace('+', '') + '?text=' + encodeURIComponent(t('salonAnswerPrefill') + ' "' + worker.name + '"')}>
                                                    <Button color={'tertiary'}>
                                                        <Icon style={{marginRight: worker.messengers.tg ? 0 : 10}}
                                                              name={'wa_light'}/>
                                                        <span
                                                            className={'va-middle'}>{worker.messengers.tg ? '' : t('sendMessage')}</span>
                                                    </Button>
                                                </a></div>
                                                {worker.messengers.tg && <div><a target="_blank" onClick={() => APIRequests.incrementStats(worker._id, 'messengerClicks')}
                                                                                 href={'https://t.me/' + worker.messengers.tg.replace('@', '')}>
                                                    <Button color={'tertiary'}>
                                                        <Icon name={'tg_light'}/>
                                                    </Button>
                                                </a></div>}
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                                <div bp={'12 7@md'}>
                                    <div className={css.cardRoot}>
                                        {!isMobile && <div className={css.padded}>
                                            {worker.isVerified && <div className={cnb(css.caption, 'non-selectable')}>
                                                <Icon name={'round_check'} className={css.verifiedIcon}/>

                                                <span>{t('verified')}</span>
                                            </div>}

                                            <div bp={'grid'}>
                                                <Link href={worker.url}><h1 bp={'7'}
                                                                            className={'cursor-pointer'}>{worker.name}</h1>
                                                </Link>

                                                <div bp={'5'}
                                                     className="flex justify-end gap-12">
                                                    <div className={css.avgRating}>
                                                        <Icon name={'star'}/>
                                                        <span>{(worker.reviews?.avg || 0).toFixed(1)}</span>
                                                    </div>

                                                    <Button size={'small'} onClick={() => this.viewSalonOnTheMap(worker._id)}>{t('onTheMap').toLowerCase()}</Button>
                                                </div>
                                            </div>
                                        </div>}

                                        <div bp={'grid'}>
                                            <div bp={'12 7@md'} className={cnb(css.padded, css.shortInfoBlock)}>
                                                <div>
                                                    <div>{t('address').toLowerCase()}</div>
                                                    <div>{worker.address}</div>
                                                </div>

                                                <div>
                                                    <div>{t('city').toLowerCase()}</div>
                                                    <div>{worker.region[0].name}</div>
                                                </div>

                                                <div>
                                                    <div>{t('reviews').toLowerCase()}</div>
                                                    <Link href={{
                                                        query: Object.assign({}, this.props.router.query, {
                                                            salonTab: 'review'
                                                        }),
                                                        hash: '#salonTab',
                                                        pathname: worker.url
                                                    }}>
                                                        <div onClick={() => APIRequests.incrementStats(worker._id, 'reviewClicks')}
                                                            className={css.linkUnderline}>{worker.reviews?.count || 0} {declination(worker.reviews?.count || 0, t('reviewDeclination'))}
                                                        </div>
                                                    </Link>
                                                </div>

                                                <div bp={'hide@md'}>
                                                    <div className={css.avgRating}>
                                                        <Icon name={'star'}/>
                                                        <span>{(worker.reviews?.avg || 0).toFixed(1)}</span>
                                                    </div>

                                                    <div><Button size={'small'} onClick={() => this.viewSalonOnTheMap(worker._id)}>{t('onTheMap').toLowerCase()}</Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div bp={'5 show@md hide'}>
                                                <div className={'flex align-end justify-end fit'}
                                                     style={{paddingBottom: 16, paddingRight: 16}}>
                                                    <div style={{marginTop: 16}} className={css.socialBlock}>
                                                        {Object.keys(worker.social).filter(i => worker.social[i].length).map(name =>
                                                            <div key={name}>
                                                                <a target="_blank" href={worker.social[name]}
                                                                   className={css.img} onClick={() => APIRequests.incrementStats(worker._id, name === 'ws' ? 'websiteClicks' : 'socialClicks')}>
                                                                    <Icon name={name + '_' + theme}/>
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {worker.kind === 'salon' ?
                                        <div bp={'12 7@md'} className={css.padded}
                                             style={{paddingRight: 0, paddingLeft: isMobile ? 0 : 16}}>
                                            <h2 style={{
                                                marginBottom: 12,
                                                paddingLeft: isMobile ? 16 : 0
                                            }}>{t('masseuses')}</h2>

                                            <div className={css.invisibleScroll}
                                                 style={{paddingLeft: isMobile ? 16 : 0}}>
                                                {worker.masters.slice(0, 4).map((master, i) => <ShortMasterCard
                                                    name={master.name}
                                                    link={{
                                                        query: Object.assign({}, this.props.router.query, {
                                                            salonTab: 'masters'
                                                        }),
                                                        hash: '#salonTab',
                                                        pathname: worker.url
                                                    }}
                                                    pic={master.photos[0]}
                                                    photoCnt={master.photos.length}
                                                    key={i}
                                                />)}
                                                {worker.masters.length > 4 &&
                                                    <MockShortMasterCard link={{
                                                        query: Object.assign({}, this.props.router.query, {
                                                            salonTab: 'masters'
                                                        }),
                                                        hash: '#salonTab',
                                                        pathname: worker.url
                                                    }}
                                                                         cnt={worker.masters.length - 4}/>}
                                            </div>
                                        </div> : <div bp={'12 7@md'} style={{marginTop: 8}}>
                                            <ParameterView {...worker.characteristics} />
                                        </div>}

                                    <div bp={'12 7@md'} className={css.padded}
                                         style={{paddingRight: 0, paddingLeft: isMobile ? 0 : 16}}>
                                        <h2 style={{
                                            marginBottom: 12,
                                            paddingLeft: isMobile ? 16 : 0
                                        }}>{t('programs')}</h2>

                                        <div className={css.invisibleScroll} style={{paddingLeft: isMobile ? 16 : 0}}>
                                            {worker.programs.slice(0, 3).map((program, i) => <ProgramCard onClick={() => APIRequests.incrementStats(worker._id, 'priceClicks')}
                                                link={{
                                                    query: Object.assign({}, this.props.router.query, {
                                                        salonTab: 'price'
                                                    }),
                                                    hash: '#salonTab',
                                                    pathname: worker.url
                                                }}
                                                key={i}
                                                title={program.name}
                                                duration={program.duration}
                                                price={program.cost}/>)}
                                            {worker.programs.length > 3 &&
                                                <MockProgramCard link={{
                                                    query: Object.assign({}, this.props.router.query, {
                                                        salonTab: 'price'
                                                    }),
                                                    hash: '#salonTab',
                                                    pathname: worker.url
                                                }} cnt={worker.programs.length - 3} onClick={() => APIRequests.incrementStats(worker._id, 'priceClicks')}/>}
                                        </div>
                                    </div>

                                    {Objects.isFilled(worker.social) && <div style={{marginTop: 8}} bp={'hide@md'}
                                                                             className={cnb(css.cardRoot, css.padded)}>
                                        <p className={'subtitle2'}>{t('socialMedia')}</p>

                                        <div style={{marginTop: 16}} className={css.socialBlock}>
                                            {Object.keys(worker.social).filter(i => worker.social[i].length).map(name =>
                                                <div key={name}>
                                                    <a target="_blank" href={worker.social[name]} className={css.img} onClick={() => APIRequests.incrementStats(worker._id, name === 'ws' ? 'websiteClicks' : 'socialClicks')}>
                                                        <Icon name={name + '_' + theme}/>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>}
                                </div>

                                <div bp={'12 hide@md'}>
                                    <div className={cnb(css.cardRoot, css.padded)}>
                                        <p className={cnb(css.ellipsis, css.helperText)}
                                           style={{marginBottom: 12}}>{worker.description}</p>

                                        <div className={css.stretchContainer}>
                                            <Link href={worker.url}>
                                                <Button>{t('detail')}</Button>
                                            </Link>
                                            <div><a href={'tel:' + parsePhoneNumber(worker.phone).number} onClick={() => APIRequests.incrementStats(worker._id, 'phoneClicks')}>
                                                <Button><Icon name={'call'}/></Button>
                                            </a></div>
                                            <div><a target="_blank" onClick={() => APIRequests.incrementStats(worker._id, 'messengerClicks')}
                                                    href={'https://wa.me/' + parsePhoneNumber(worker.messengers.wa).number.replace('+', '') + '?text=' + encodeURIComponent(t('salonAnswerPrefill') + ' "' + worker.name + '"')}>
                                                <Button color={'tertiary'}>
                                                    <Icon style={{marginRight: worker.messengers.tg ? 0 : 6}}
                                                          name={'wa_light'}/>
                                                    <span
                                                        className={'va-middle'}>{worker.messengers.tg ? '' : t('sendMessage')}</span>
                                                </Button>
                                            </a></div>
                                            {worker.messengers.tg && <div><a target="_blank" onClick={() => APIRequests.incrementStats(worker._id, 'messengerClicks')}
                                                                             href={'https://t.me/' + worker.messengers.tg.replace('@', '')}>
                                                <Button color={'tertiary'}>
                                                    <Icon name={'tg_light'}/>
                                                </Button>
                                            </a></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>

                <div className="flex justify-center">
                    {(((Number(this.props.router.query.page) || 1) !== this.state.pageCount) && !this.state.preventLoading && this.state.workers.length > 0 && !this.state.isMapView) &&
                        <Button className={css.showMoreBtn} size={'large'} onClick={this.loadMore}>
                            <span className={'va-middle'}>{t('showNSalonsMore', 5)}</span>
                            <Icon name={'refresh'}/>
                        </Button>}
                </div>

                {(this.state.pageCount > 1 && !this.state.isMapView) &&
                    <Paginator style={{marginBottom: 24}} page={this.getPage()}
                               onChange={this.handlePageChange}
                               pageCnt={this.state.pageCount}/>}

                <AboutUsSection/>
            </div>
        );
    }
}

export default withRouter(Home);
