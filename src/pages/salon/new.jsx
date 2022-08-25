import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import Stepper from "../../components/kit/Stepper.jsx";
import css from '../../styles/new.page.module.scss';
import TextInput from "../../components/kit/Form/TextInput.jsx";
import Select from "../../components/kit/Form/Select.jsx";
import Collapsible from "../../components/kit/Collapses/Collapsible.jsx";
import TextArea from "../../components/kit/Form/TextArea";
import RadioGroup from "../../components/kit/Form/RadioGroup";
import {capitalize} from "../../helpers/String";
import Breadcrumbs from "../../components/kit/Breadcrumbs.jsx";
import {cnb} from "cnbuilder";
import Button from "../../components/kit/Button.jsx";
import {isValidPhoneNumber} from "libphonenumber-js";
import Icon from "../../components/kit/Icon.jsx";
import Checkbox from "../../components/kit/Form/Checkbox";
import RangeInput from "../../components/kit/Form/RangeInput";
import APIRequests from "../../helpers/APIRequests.js";
import ImageInput from "../../components/kit/Form/ImageInput";
import MockImageInput from "../../components/kit/Form/MockImageInput";
import Tag from "../../components/kit/Tag";
import Program from "../../components/kit/Program.jsx";
import Head from "next/head.js";
import {TITLE_POSTFIX, YANDEX_APIKEY} from "../../helpers/constants.js";
import Modal from "../../components/kit/Modal";
import {withRouter} from "next/router.js";
import Script from "next/script.js";

class NewSalonPage extends React.Component {
    static contextType = GlobalContext

    constructor(props) {
        super(props);

        this.state = {
            step: -1,
            dialogOpen: false,
            placeMark: undefined,
            map: undefined,
            model: {
                kind: 'salon',

                name: '',
                region: '',
                phone: '+7',
                address: '',
                description: '',
                location: [],

                services: [],
                leads: [],
                rooms: 3,

                social: {
                    vk: '',
                    inst: '',
                    tgCh: '',
                    ws: ''
                },
                messengers: {
                    tg: '',
                    wa: ''
                },

                programs: [],

                workHours: {
                    from: '08:30',
                    to: '20:00',
                    roundclock: false
                },
                workDays: [],

                photos: [],

                masters: []
            },
            prefetched: {
                regions: [],
                leads: [],
                services: []
            }
        }

        this.stepChangeHandler = this.stepChangeHandler.bind(this);
        this.setField = this.setField.bind(this);
        this.updatePrograms = this.updatePrograms.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this.toggleLead = this.toggleLead.bind(this);
        this.toggleService = this.toggleService.bind(this);
        this.setSocialMedia = this.setSocialMedia.bind(this);
        this.setMessenger = this.setMessenger.bind(this);
        this.updateWorkHours = this.updateWorkHours.bind(this);
        this.toggleWorkDay = this.toggleWorkDay.bind(this);
        this.addPhotoInput = this.addPhotoInput.bind(this);
        this.setPhoto = this.setPhoto.bind(this);
        this.setAllWorkDays = this.setAllWorkDays.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.addAnotherMaster = this.addAnotherMaster.bind(this);
        this.addMasterPhotoInput = this.addMasterPhotoInput.bind(this);
        this.geoCode = this.geoCode.bind(this);
        this.openSuccessDialog = this.openSuccessDialog.bind(this);
        this.closeSuccessDialog = this.closeSuccessDialog.bind(this);
        this.addOwnVariant = this.addOwnVariant.bind(this);
        this.loadSalonToEdit = this.loadSalonToEdit.bind(this)
    }

    toggleWorkDay(day) {
        let workDays = this.state.model.workDays;

        if (workDays.includes(day)) {
            workDays = workDays.filter(i => i !== day);
        } else {
            workDays.push(day);
        }

        this.setState({
            model: {
                ...this.state.model,
                workDays
            }
        })
    }

    async componentDidMount() {
        const programs = (await APIRequests.getPrograms()).map(i => ({
                ...i,
                duration: 15,
                eroticCnt: 1,
                classicCnt: 1,
                relaxCnt: 1,
                enabled: false
            })),
            services = await APIRequests.getServices(),
            leads = await APIRequests.getLeads(),
            regions = await APIRequests.getRegions();

        programs.push({
            name: this.context.t('myVariant'),
            description: '',
            duration: 15,
            eroticCnt: 1,
            classicCnt: 1,
            relaxCnt: 1,
            enabled: false
        })

        this.setState({
            model: {
                ...this.state.model,
                programs,
                photos: Array(this.context.isMobile ? 5 : 3).fill(''),
                masters: [{
                    name: '',
                    characteristics: {
                        height: '',
                        weight: '',
                        age: '',
                        bust: '1',
                        hair: 'брюнетка',
                        eyes: 'голубые'
                    },
                    photos: Array(5).fill('')
                }]
            },
            prefetched: {
                services,
                leads,
                regions
            }
        }, () => this.props.router.query.edit && this.loadSalonToEdit(this.props.router.query.edit))
    }

    addOwnVariant() {
        this.setState({
            model: {
                ...this.state.model,
                programs: [...this.state.model.programs, {
                    name: this.context.t('myVariant'),
                    description: '',
                    duration: 15,
                    eroticCnt: 1,
                    classicCnt: 1,
                    relaxCnt: 1,
                    enabled: false
                }]
            }
        })
    }

    setAllWorkDays() {
        this.setState({
            model: {
                ...this.state.model,
                workDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
            }
        })
    }

    addPhotoInput() {
        this.setState({
            model: {
                ...this.state.model,
                photos: [...this.state.model.photos, '']
            }
        })
    }

    addMasterPhotoInput(index) {
        this.setState({
            model: {
                ...this.state.model,
                masters: [...this.state.model.masters.slice(0, index), {
                    ...this.state.model.masters[index],
                    photos: [...this.state.model.masters[index].photos, '']
                }, ...this.state.model.masters.slice(index + 1)]
            }
        })
    }

    addAnotherMaster() {
        this.setState({
            model: {
                ...this.state.model,
                masters: [...this.state.model.masters, {
                    name: '',
                    characteristics: {
                        height: '',
                        weight: '',
                        age: '',
                        bust: '1',
                        hair: 'брюнетка',
                        eyes: 'голубые'
                    },
                    photos: Array(5).fill('')
                }]
            }
        })
    }

    async stepChangeHandler(step) {
        if (step === 5 && this.state.model.kind === 'master') {
            return this.setState({
                step: this.state.step === 4 ? 6 : 4
            })
        }

        if (step === 1) {
            if (this.state.model.messengers.wa.length === 0) {
                await this.setState({
                    model: {
                        ...this.state.model,
                        messengers: {
                            ...this.state.model.messengers,
                            wa: this.state.model.phone
                        }
                    }
                })
            }

            if (this.state.model.kind === 'master' && !this.state.model.masters[0].name.length) {
                this.setState({
                    model: {
                        ...this.state.model,
                        masters: [Object.assign({}, this.state.model.masters[0], {name: this.state.model.name})]
                    }
                })
            }
        }

        this.setState({step})

        if (step === 0) {
            let userLocation

            try {
                userLocation = (await window.ymaps.geolocation.get()).geoObjects.position
            } catch (e) {
                userLocation = [43.2177019, 76.9441652]
            }

            const mapClickHandler = async (e) => {
                const coords = e.get('coords');

                if (this.state.placeMark) {
                    await this.setState({
                        model: {
                            ...this.state.model,
                            location: coords
                        }
                    });

                    this.state.placeMark.geometry.setCoordinates(coords);
                } else {
                    const placeMark = new window.ymaps.Placemark(coords, {}, {
                        iconImageHref: '/icons/point.svg',
                        iconLayout: 'default#image',
                    })

                    await this.setState({
                        placeMark,
                        model: {
                            ...this.state.model,
                            location: coords
                        }
                    });

                    this.state.map.geoObjects.add(placeMark);
                }
            }

            if (!this.state.map) {
                const initMap = () => {
                    const map = new ymaps.Map('addSalonMap', {
                        center: userLocation,
                        zoom: 12,
                        controls: []
                    }, {})

                    map.events.add('click', mapClickHandler.bind(this))
                    // map.container.fitToViewport()
// window.map = map
                    this.setState({
                        map
                    })
                }

                window.ymaps.ready(initMap.bind(this))
            }
        }

        if (step === 6) {
            this.setState({
                model: {
                    ...this.state.model,
                    photos: this.state.model.photos.filter(i => i.length)
                }
            })
        }

        if (step === 7) {
            let masters = [...this.state.model.masters]
                .filter(i => i.name && i.characteristics?.height > 0 && i?.characteristics.weight > 0 && i?.characteristics.age > 0)
                .map(i => {
                    i.photos = i.photos.filter(j => j.length > 0)

                    return i
                })

            this.setState({
                model: {
                    ...this.state.model,
                    masters
                }
            })
        }

        window.document.body.scrollTo(0, 0)
    }

    setField(field, value) {
        if (field === 'region') {
            this.state.map.setCenter(this.state.prefetched.regions.find(i => i._id === value).center, 12)
        }

        this.setState({
            model: {
                ...this.state.model,
                [field]: value
            }
        })
    }

    setMasterField(masterIndex, field, value) {
        const masters = [...this.state.model.masters];

        masters[masterIndex][field] = value;

        this.setState({
            model: {
                ...this.state.model,
                masters
            }
        })
    }

    toggleService(serviceId) {
        let services = this.state.model.services;

        if (services.includes(serviceId)) {
            services = services.filter(i => i !== serviceId);
        } else {
            services.push(serviceId);
        }

        this.setState({
            model: {
                ...this.state.model,
                services
            }
        })
    }

    setMasterParam(masterIndex, param, value) {
        const masters = [...this.state.model.masters];

        masters[masterIndex].characteristics[param] = value;

        this.setState({
            model: {
                ...this.state.model,
                masters
            }
        })
    }

    toggleLead(leadId) {
        let leads = this.state.model.leads;

        if (leads.includes(leadId)) {
            leads = leads.filter(i => i !== leadId);
        } else {
            leads.push(leadId);
        }

        this.setState({
            model: {
                ...this.state.model,
                leads
            }
        })
    }

    validateStep(step) {
        let isValid = true

        switch (step) {
            case 0:
                if (!isValidPhoneNumber(this.state.model.phone, 'KZ')) {
                    isValid = false
                    break
                }

                if (this.state.model.name.length < 3 || this.state.model.name.length > 64) {
                    isValid = false
                    break
                }

                if (!this.state.model.region) {
                    isValid = false
                    break
                }

                if (this.state.model.location.length < 2) {
                    isValid = false
                    break
                }

                if (this.state.model.description.length < 20) {
                    isValid = false
                    break
                }

                if (this.state.model.address.length < 3 || this.state.model.address.length > 128) {
                    isValid = false
                    break
                }

                break;

            case 1:
                if (!isValidPhoneNumber(this.state.model.messengers.wa, 'KZ')) {
                    isValid = false
                    break
                }

                if (this.state.model.social.inst.length >= 1 && !/^https:\/\/(www\.)?instagram\.com\//.test(this.state.model.social.inst)) {
                    isValid = false
                    break
                }

                if (this.state.model.social.vk.length >= 1 && !/^https:\/\/(www\.)?vk\.com\//.test(this.state.model.social.vk)) {
                    isValid = false
                    break
                }

                if (this.state.model.social.tgCh.length >= 1 && !/^https:\/\/(www\.)?t\.me\//.test(this.state.model.social.tgCh)) {
                    isValid = false
                    break
                }

                if (this.state.model.social.ws.length >= 1 && !/^https?:\/\//.test(this.state.model.social.ws)) {
                    isValid = false
                    break
                }
                break

            case 2:
                if (this.state.model.leads.length < 1) {
                    isValid = false
                    break
                }
                break

            case 3:
                const enabledPrograms = this.state.model.programs.filter(i => i.enabled)

                if (enabledPrograms.length < 1) {
                    isValid = false
                    break
                }

                if (!enabledPrograms.every(i => i.cost > 0 && i.description.length > 0 && i.name.length > 0)) {
                    isValid = false
                    break
                }
                break

            case 4:
                if (this.state.model.workDays.length === 0) {
                    isValid = false
                    break
                }
                break

            case 5:
                if (this.state.model.photos.every(i => i.length === 0)) {
                    isValid = false
                    break
                }
                break

            case 6:
                const testingTargets = [...this.state.model.masters].filter(i => i.name.length && i.photos.some(j => j.length) && i.characteristics.height.length && i.characteristics.weight.length && i.characteristics.age.length)

                if (testingTargets.length < 1) {
                    isValid = false
                    break
                }

                if (!testingTargets.every(i => i.name.length >= 3 && i.name.length <= 64 && i.characteristics.height >= 70 && i.characteristics.height <= 250 && i.characteristics.weight >= 30 && i.characteristics.weight <= 150 && i.characteristics.age >= 18 && i.characteristics.age <= 99)) {
                    isValid = false
                    break
                }
        }

        return !isValid
    }

    setMessenger(messenger, val) {
        this.setState({
            model: {
                ...this.state.model,
                messengers: {
                    ...this.state.model.messengers,
                    [messenger]: val
                }
            }
        })
    }

    loadSalonToEdit(slug) {
        APIRequests.getWorker(slug).then(res => {
            // console.log(res)
            // console.log(this.state.model)

            if (res.worker[0].kind === 'salon') {
                for (const masterKey in res.worker[0].masters) {
                    for (const characteristicsKey in res.worker[0].masters[masterKey].characteristics) {
                        res.worker[0].masters[masterKey].characteristics[characteristicsKey] = String(res.worker[0].characteristics[characteristicsKey])
                    }
                }
            }

            this.setState({
                model: {
                    ...res.worker[0],
                    region: res.worker[0].region._id,
                    services: res.worker[0].services.map(i => i._id),
                    leads: res.worker[0].leads.map(i => i._id),
                    location: res.worker[0].location.coordinates,
                    masters: res.worker[0].kind === 'salon' ? res.worker[0].masters : [{
                        name: res.worker[0].name,
                        characteristics: (() => {
                            const mappedCharacteristics = {}

                            for (const characteristicsKey in res.worker[0].characteristics) {
                                mappedCharacteristics[characteristicsKey] = String(res.worker[0].characteristics[characteristicsKey])
                            }

                            return mappedCharacteristics
                        })(),
                        photos: res.worker[0].photos
                    }],
                    programs: this.state.model.programs.map(i => {
                        const enabledProgram = res.worker[0].programs.find(j => j._id === i._id)

                        if (enabledProgram) {
                            enabledProgram.enabled = true
                        }

                        return enabledProgram || i
                    })
                },
                step: 7
            })
        })
    }

    setSocialMedia(socialMedia, val) {
        this.setState({
            model: {
                ...this.state.model,
                social: {
                    ...this.state.model.social,
                    [socialMedia]: val
                }
            }
        })
    }

    setPhoto(index, val) {
        this.setState({
            model: {
                ...this.state.model,
                photos: [...this.state.model.photos.slice(0, index), val, ...this.state.model.photos.slice(index + 1)]
            }
        })
    }

    geoCode() {
        const region = this.state.prefetched.regions.find(i => i._id === this.state.model.region)?.name,
            fullAddress = (region ? region + ', ' : '') + this.state.model.address

        window.ymaps.geocode(fullAddress, {
            results: 1
        }).then((res) => {
            const coords = res.geoObjects.get(0).geometry.getCoordinates()

            this.setState({
                placeMark: new window.ymaps.Placemark(coords, {}, {
                    iconImageHref: '/icons/point.svg',
                    iconLayout: 'default#image'
                }),
                model: {
                    ...this.state.model,
                    location: coords
                }
            })
        })
    }

    updateWorkHours(workHours) {
        this.setState({
            model: {
                ...this.state.model,
                workHours: Object.assign({}, this.state.model.workHours, workHours)
            }
        })
    }

    openSuccessDialog() {
        this.setState({
            dialogOpen: true
        })
    }

    closeSuccessDialog() {
        this.props.router.push('/')
    }

    setMasterPhoto(masterIndex, photoIndex, photo) {
        const masters = [...this.state.model.masters];

        masters[masterIndex].photos[photoIndex] = photo;

        this.setState({
            model: {
                ...this.state.model,
                masters
            }
        })
    }

    updatePrograms(id, index, field, val) {
        const newModel = {...this.state.model};

        if (newModel.programs[index]._id === id) {
            newModel.programs[newModel.programs.findIndex(program => program._id === id)][field] = val
        } else {
            newModel.programs[index][field] = val
        }

        if (newModel.programs[index].cost > 0 && newModel.programs[index].description.length > 0 && newModel.programs[index].name.length > 0) {
            newModel.programs[index].enabled = true
        }

        this.setState({model: newModel})
    }

    async submitForm() {
        const model = {...this.state.model}

        model.programs = model.programs.filter(i => i.enabled)

        const res = await APIRequests.createWorker(model)

        if (res.ok) {
            this.openSuccessDialog()
        }
    }

    render() {
        const {t, isMobile, theme} = this.context;

        const workHours = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',
            '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
            '23:00', '23:30']
            .map(i => ({
                _id: i,
                name: i
            })),
            isEditing = !!this.props.router.query.edit

        return <div className={css['theme--' + theme]}>
            <Head>
                <title>{isEditing ? t('editingSalon') : t('addingSalon')}{TITLE_POSTFIX}</title>
            </Head>

            <Script src={'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=' + YANDEX_APIKEY}
                    strategy={'beforeInteractive'}/>

            <Modal modalStyle={{maxWidth: 380, position: 'relative'}} open={this.state.dialogOpen} isMobile={false}
                   onUpdate={this.closeSuccessDialog}>
                <div className={css.modalBody}>
                    <p>{t('cool')}</p>

                    <h1>{t('salonSentToModeration')}</h1>

                    <Button size={'fill'} onClick={this.closeSuccessDialog}>{t('toMainPage')}</Button>

                    <Icon name={'close'} className={css.modalClose} onClick={this.closeSuccessDialog}/>
                </div>
            </Modal>

            <Breadcrumbs items={[
                {
                    name: t('mainPage'),
                    href: '/',
                },
                {
                    name: isEditing ? t('editingSalon') : t('addingSalon'),
                    href: '/salon/new',
                },
            ]}/>
            {this.state.step === -1 ? <div className={css.stepBody}>
                <h1 style={{marginBottom: 8}}>{isEditing ? t('editingSalon') : t('addingSalon')}</h1>
                <p>{t('chooseWorkerType')}</p>

                <div className={css.aligner}>
                    <div bp={'grid 12 4@md'} style={{width: '100%'}}>
                        <div onClick={() => this.setField('kind', 'salon')}
                             className={cnb('flex cursor-pointer justify-between vertical-center', css.secondLayer)}>
                            <div>
                                <h4>{t('salon')}</h4>
                                <p className={css.caption}>{t('ifYouAreOrganization')}</p>
                            </div>
                            <div>
                                <div className={css.radioItem}>
                                    <div
                                        className={cnb(css.radio, this.state.model.kind === 'salon' ? css.checked : '')}>&nbsp;</div>
                                </div>
                            </div>
                        </div>

                        <div onClick={() => this.setField('kind', 'master')}
                             className={cnb('flex cursor-pointer justify-between vertical-center', css.secondLayer)}>
                            <div>
                                <h4>{t('privateMaster')}</h4>
                                <p className={css.caption}>{t('ifYouArePrivateSpec')}</p>
                            </div>
                            <div>
                                <div className={css.radioItem}>
                                    <div
                                        className={cnb(css.radio, this.state.model.kind === 'master' ? css.checked : '')}>&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button className={css.proceedBtn} color={'secondary'} style={isMobile ? {width: '100%'} : {}}
                        onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                    {t('pass')}
                    <Icon name={'arrow_right'}/>
                </Button>
            </div> : <Stepper step={this.state.step} title={isEditing ? t('editingSalon') : t('addingSalon')}
                              steps={[
                                  (<div className={css.stepBody}>
                                      <h2>{t('fillCommonInfo')}</h2>
                                      <div bp={'grid 12 4@md'}>
                                          <TextInput
                                              label={t(this.state.model.kind === 'salon' ? 'salonName' : 'yourNickname')}
                                              placeholder={t(this.state.model.kind === 'salon' ? 'howYourSalonNamed' : 'enterYourWorkNickname')}
                                              value={this.state.model.name}
                                              onUpdate={(val) => this.setField('name', val)}/>
                                          <Select options={this.state.prefetched.regions} label={t('city')}
                                                  placeholder={t('inWhichCity')} value={this.state.model.region}
                                                  onUpdate={(val) => this.setField('region', val)}/>
                                          <div bp={'hide show@md'}></div>
                                          <TextInput label={t('streetAndAddress')}
                                                     placeholder={t('salonAddress')}
                                                     value={this.state.model.address}
                                                     onUpdate={(val) => this.setField('address', val)}/>
                                          <TextInput label={t('phone')} type={'phone'}
                                                     placeholder={t('typeYourPhoneNumber')}
                                                     value={this.state.model.phone}
                                                     onUpdate={(val) => this.setField('phone', val)}/>

                                          <div bp={'hide show@md'}></div>
                                          <div>
                                              <TextArea max={500} min={20} label={t('salonDescription')}
                                                        onUpdate={(val) => this.setField('description', val)}
                                                        value={this.state.model.description}
                                                        className={css.textAreaGrow}
                                                        placeholder={t('describeYourSalon')}/>
                                          </div>

                                          <div id={'addSalonMap'} className={'roundedMap'}></div>
                                      </div>

                                      <div className={css.btnContainer}>
                                          <Button className={css.backBtn}
                                                  color={'tertiary'} isDisabled={isEditing}
                                                  onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                              <Icon name={'arrow_left'}/>
                                              {t('back')}
                                          </Button>

                                          <Button isDisabled={this.validateStep(this.state.step)}
                                                  className={css.proceedBtn}
                                                  color={'secondary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                              {t('pass')}
                                              <Icon name={'arrow_right'}/>
                                          </Button>
                                      </div>
                                  </div>),
                                  (<div className={css.stepBody}>
                                      <h2>{t('fillContactInfo')}</h2>
                                      <div bp={'grid 12 4@md'} style={{gap: 45}}>
                                          <div>
                                              <h3 style={{marginBottom: 12}}>{t('socialMedia')}</h3>

                                              <TextInput style={{marginBottom: 12}} label={t('vkFull')}
                                                         placeholder={'https://vk.com/'}
                                                         value={this.state.model.social.vk}
                                                         onUpdate={(val) => this.setSocialMedia('vk', val)}/>

                                              <TextInput style={{marginBottom: 12}} label={t('instagram')}
                                                         placeholder={'https://instagram.com/'}
                                                         value={this.state.model.social.inst}
                                                         onUpdate={(val) => this.setSocialMedia('inst', val)}/>

                                              <TextInput style={{marginBottom: 12}} label={t('tgChannel')}
                                                         placeholder={'https://t.me/'}
                                                         value={this.state.model.social.tgCh}
                                                         onUpdate={(val) => this.setSocialMedia('tgCh', val)}/>

                                              <TextInput label={t('site')} placeholder={'https://'}
                                                         value={this.state.model.social.ws}
                                                         onUpdate={(val) => this.setSocialMedia('ws', val)}/>
                                          </div>
                                          <div bp={'first last@md'}>
                                              <h3 style={{marginBottom: 12}}>{t('messengers')}</h3>

                                              <TextInput style={{marginBottom: 12}} label={t('tg')} placeholder={'@'}
                                                         value={this.state.model.messengers.tg}
                                                         onUpdate={(val) => this.setMessenger('tg', val)}/>

                                              <TextInput type={'phone'} label={t('whatsapp')} placeholder={'+7'}
                                                         value={this.state.model.messengers.wa}
                                                         onUpdate={(val) => this.setMessenger('wa', val)}/>
                                          </div>
                                      </div>

                                      <div className={css.btnContainer}>
                                          <Button className={css.backBtn}
                                                  color={'tertiary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                              <Icon name={'arrow_left'}/>
                                              {t('back')}
                                          </Button>

                                          <Button isDisabled={this.validateStep(this.state.step)}
                                                  className={css.proceedBtn}
                                                  color={'secondary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                              {t('pass')}
                                              <Icon name={'arrow_right'}/>
                                          </Button>
                                      </div>
                                  </div>),
                                  (<div className={css.stepBody}>
                                      <h2>{t('whichServicesYouProvide')}</h2>
                                      <div bp={'grid 12 4@md'} style={{gap: 45}}>
                                          <div>
                                              <h3 style={{marginBottom: 16}}>{t('services')}</h3>

                                              <div className={css.textCaption}>
                                                  {this.state.prefetched.services.map((service, index) =>
                                                      <Checkbox style={{marginBottom: 12}} name={service.name}
                                                                key={index}
                                                                onUpdate={() => this.toggleService(service._id)}
                                                                value={this.state.model.services.includes(service._id)}
                                                                icon={service.icon}/>
                                                  )}
                                              </div>
                                          </div>
                                          <div>
                                              <h3 style={{marginBottom: 16}}>{t('massageFor')}</h3>

                                              <div className={css.textCaption}>
                                                  {this.state.prefetched.leads.map((lead, index) =>
                                                      <Checkbox style={{marginBottom: 12}} name={lead.name} key={index}
                                                                onUpdate={() => this.toggleLead(lead._id)}
                                                                value={this.state.model.leads.includes(lead._id)}
                                                                icon={lead.icon}/>
                                                  )}
                                              </div>

                                              <h3 style={{marginBottom: 16, marginTop: 24}}>{t('roomCnt')}</h3>

                                              <RangeInput max={20} onUpdate={val => this.setField('rooms', val)}
                                                          value={this.state.model.rooms}/>
                                          </div>
                                      </div>

                                      <div className={css.btnContainer}>
                                          <Button className={css.backBtn}
                                                  color={'tertiary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                              <Icon name={'arrow_left'}/>
                                              {t('back')}
                                          </Button>

                                          <Button isDisabled={this.validateStep(this.state.step)}
                                                  className={css.proceedBtn}
                                                  color={'secondary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                              {t('pass')}
                                              <Icon name={'arrow_right'}/>
                                          </Button>
                                      </div>
                                  </div>),
                                  (<div>
                                      <h2 style={{
                                          marginBottom: 16,
                                          marginTop: isMobile ? 0 : 32,
                                          padding: isMobile ? '0 16px' : 0
                                      }}>{t('whichMassageTypesYouProvide')}</h2>

                                      <div bp={'grid 12 6@md'} style={{gap: 30}}>
                                          <div className={'flex gap-12 column'}>
                                              {this.state.model.programs.filter(i => i._id).map((program, i) =>
                                                  <Collapsible defaultOpen={i === 0} selectable={true} key={i}
                                                               value={this.state.model.programs[i].enabled}
                                                               onUpdate={(state) => this.updatePrograms(program._id, i, 'enabled', state)}
                                                               title={program.name}>
                                                      <div style={{marginTop: 12}}>
                                                          <TextArea disabled={true} max={200}
                                                                    value={this.state.model.programs[i].description}
                                                                    label={t('description')}
                                                                    placeholder={t('tellAboutService')}/>
                                                          <RadioGroup
                                                              onUpdate={val => this.updatePrograms(program._id, i, 'eroticCnt', val)}
                                                              value={this.state.model.programs[i].eroticCnt}
                                                              style={{marginTop: 12}}
                                                              name={capitalize(t('eroticMassage')) + ' (' + t('pc') + ')'}
                                                              options={[
                                                                  {
                                                                      label: 0,
                                                                      value: 0
                                                                  },
                                                                  {
                                                                      label: 1,
                                                                      value: 1
                                                                  },
                                                                  {
                                                                      label: 2,
                                                                      value: 2
                                                                  },
                                                                  {
                                                                      label: '3+',
                                                                      value: 3
                                                                  }
                                                              ]}/>
                                                          <RadioGroup
                                                              onUpdate={val => this.updatePrograms(program._id, i, 'classicCnt', val)}
                                                              name={capitalize(t('classicMassage')) + ' (' + t('pc') + ')'}
                                                              value={this.state.model.programs[i].classicCnt}
                                                              options={[
                                                                  {
                                                                      label: 0,
                                                                      value: 0
                                                                  },
                                                                  {
                                                                      label: 1,
                                                                      value: 1
                                                                  },
                                                                  {
                                                                      label: 2,
                                                                      value: 2
                                                                  },
                                                                  {
                                                                      label: '3+',
                                                                      value: 3
                                                                  }
                                                              ]}/>
                                                          <RadioGroup
                                                              onUpdate={val => this.updatePrograms(program._id, i, 'relaxCnt', val)}
                                                              name={capitalize(t('relaxMassage')) + ' (' + t('pc') + ')'}
                                                              value={this.state.model.programs[i].relaxCnt}
                                                              options={[
                                                                  {
                                                                      label: 0,
                                                                      value: 0
                                                                  },
                                                                  {
                                                                      label: 1,
                                                                      value: 1
                                                                  },
                                                                  {
                                                                      label: 2,
                                                                      value: 2
                                                                  },
                                                                  {
                                                                      label: '3+',
                                                                      value: 3
                                                                  }
                                                              ]}/>
                                                          <RadioGroup
                                                              onUpdate={val => this.updatePrograms(program._id, i, 'duration', val)}
                                                              name={capitalize(t('duration')) + ' (' + t('minutesShort') + ')'}
                                                              value={this.state.model.programs[i].duration}
                                                              options={[
                                                                  {
                                                                      label: '15',
                                                                      value: 15
                                                                  },
                                                                  {
                                                                      label: '30',
                                                                      value: 30
                                                                  },
                                                                  {
                                                                      label: '60',
                                                                      value: 60
                                                                  },
                                                                  {
                                                                      label: '90+',
                                                                      value: 90
                                                                  }
                                                              ]}/>
                                                      </div>
                                                      <TextInput
                                                          onUpdate={val => this.updatePrograms(program._id, i, 'cost', val)}
                                                          value={this.state.model.programs[i].cost}
                                                          style={{marginBottom: 6}}
                                                          label={t('massageCost') + ' (' + t('kzt') + ')'}
                                                          placeholder={t('from')} type={'number'}/>
                                                  </Collapsible>
                                              )}
                                          </div>
                                          <div className={'flex gap-12 column'}>
                                              {this.state.model.programs.map((program, i) => {
                                                  return program._id ? '' :
                                                      <Collapsible defaultOpen={i === 0} selectable={true} key={i}
                                                                   value={this.state.model.programs[i].enabled}
                                                                   onUpdate={(state) => this.updatePrograms('', i, 'enabled', state)}
                                                                   title={program.name}>
                                                          <div style={{marginTop: 12}}>
                                                              <TextInput
                                                                  style={{marginBottom: 12}}
                                                                  onUpdate={val => this.updatePrograms('', i, 'name', val)}
                                                                  value={this.state.model.programs[i].name}
                                                                  label={t('name')} maxLength={40}
                                                                  placeholder={t('nameYourProgram')}/>

                                                              <TextArea
                                                                  onUpdate={val => this.updatePrograms('', i, 'description', val)}
                                                                  value={this.state.model.programs[i].description}
                                                                  label={t('description')} max={200}
                                                                  placeholder={t('tellAboutService')}/>

                                                              <RadioGroup
                                                                  onUpdate={val => this.updatePrograms('', i, 'eroticCnt', val)}
                                                                  value={this.state.model.programs[i].eroticCnt}
                                                                  style={{marginTop: 12}}
                                                                  name={capitalize(t('eroticMassage')) + ' (' + t('pc') + ')'}
                                                                  options={[
                                                                      {
                                                                          label: 0,
                                                                          value: 0
                                                                      },
                                                                      {
                                                                          label: 1,
                                                                          value: 1
                                                                      },
                                                                      {
                                                                          label: 2,
                                                                          value: 2
                                                                      },
                                                                      {
                                                                          label: '3+',
                                                                          value: 3
                                                                      }
                                                                  ]}/>
                                                              <RadioGroup
                                                                  onUpdate={val => this.updatePrograms('', i, 'classicCnt', val)}
                                                                  name={capitalize(t('classicMassage')) + ' (' + t('pc') + ')'}
                                                                  value={this.state.model.programs[i].classicCnt}
                                                                  options={[
                                                                      {
                                                                          label: 0,
                                                                          value: 0
                                                                      },
                                                                      {
                                                                          label: 1,
                                                                          value: 1
                                                                      },
                                                                      {
                                                                          label: 2,
                                                                          value: 2
                                                                      },
                                                                      {
                                                                          label: '3+',
                                                                          value: 3
                                                                      }
                                                                  ]}/>
                                                              <RadioGroup
                                                                  onUpdate={val => this.updatePrograms('', i, 'relaxCnt', val)}
                                                                  name={capitalize(t('relaxMassage')) + ' (' + t('pc') + ')'}
                                                                  value={this.state.model.programs[i].relaxCnt}
                                                                  options={[
                                                                      {
                                                                          label: 0,
                                                                          value: 0
                                                                      },
                                                                      {
                                                                          label: 1,
                                                                          value: 1
                                                                      },
                                                                      {
                                                                          label: 2,
                                                                          value: 2
                                                                      },
                                                                      {
                                                                          label: '3+',
                                                                          value: 3
                                                                      }
                                                                  ]}/>
                                                              <RadioGroup
                                                                  onUpdate={val => this.updatePrograms('', i, 'duration', val)}
                                                                  name={capitalize(t('duration')) + ' (' + t('minutesShort') + ')'}
                                                                  value={this.state.model.programs[i].duration}
                                                                  options={[
                                                                      {
                                                                          label: '15',
                                                                          value: 15
                                                                      },
                                                                      {
                                                                          label: '30',
                                                                          value: 30
                                                                      },
                                                                      {
                                                                          label: '60',
                                                                          value: 60
                                                                      },
                                                                      {
                                                                          label: '90+',
                                                                          value: 90
                                                                      }
                                                                  ]}/>
                                                          </div>
                                                          <TextInput
                                                              onUpdate={val => this.updatePrograms('', i, 'cost', val)}
                                                              value={this.state.model.programs[i].cost}
                                                              style={{marginBottom: 6}}
                                                              label={t('massageCost') + ' (' + t('kzt') + ')'}
                                                              placeholder={t('from')} type={'number'}/>
                                                      </Collapsible>
                                              })}

                                              <Button className={css.addOwnVariantBtn}
                                                      onClick={this.addOwnVariant}>{t('addOwnVariant')}</Button>
                                          </div>
                                      </div>

                                      <div className={css.btnContainer}>
                                          <Button className={css.backBtn}
                                                  color={'tertiary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                              <Icon name={'arrow_left'}/>
                                              {t('back')}
                                          </Button>

                                          <Button isDisabled={this.validateStep(this.state.step)}
                                                  className={css.proceedBtn}
                                                  color={'secondary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                              {t('pass')}
                                              <Icon name={'arrow_right'}/>
                                          </Button>
                                      </div>
                                  </div>),
                                  (<div className={css.stepBody}>
                                      <h2 style={{margin: '24px 0'}}>{t('salonSchedule')}</h2>

                                      <div bp={'grid 12 6@md'} style={{gap: 45}}>
                                          <div>
                                              <h3 style={{marginBottom: 12}}>{t('workTime')}</h3>
                                              <div className="flex gap-12">
                                                  <Select disabled={this.state.model.workHours.roundclock}
                                                          value={this.state.model.workHours.roundclock ? '00:00' : this.state.model.workHours.from}
                                                          onUpdate={val => this.updateWorkHours({from: val})}
                                                          label={t('opening')} options={workHours} placeholder={''}/>
                                                  <Select disabled={this.state.model.workHours.roundclock}
                                                          value={this.state.model.workHours.roundclock ? '00:00' : this.state.model.workHours.to}
                                                          onUpdate={val => this.updateWorkHours({to: val})}
                                                          label={t('closing')}
                                                          options={workHours.filter(h => h.value !== this.state.model.workHours.from)}
                                                          placeholder={''}/>
                                              </div>

                                              <div className={'flex'} style={{marginTop: 16}}>
                                                  <Checkbox reverse value={this.state.model.workHours.roundclock}
                                                            name={t('roundclock')}
                                                            onUpdate={() => this.updateWorkHours({roundclock: !this.state.model.workHours.roundclock})}/>
                                              </div>
                                          </div>

                                          <div>
                                              <h3 style={{marginBottom: 12}}>{t('salonWorkDays')}</h3>

                                              <div className="flex wrap gap-12">
                                                  <Checkbox reverse value={this.state.model.workDays.includes('mon')}
                                                            name={t('mon')} onUpdate={() => this.toggleWorkDay('mon')}/>
                                                  <Checkbox reverse value={this.state.model.workDays.includes('tue')}
                                                            name={t('tue')} onUpdate={() => this.toggleWorkDay('tue')}/>
                                                  <Checkbox reverse value={this.state.model.workDays.includes('wed')}
                                                            name={t('wed')} onUpdate={() => this.toggleWorkDay('wed')}/>
                                                  <Checkbox reverse value={this.state.model.workDays.includes('thu')}
                                                            name={t('thu')} onUpdate={() => this.toggleWorkDay('thu')}/>
                                                  <Checkbox reverse value={this.state.model.workDays.includes('fri')}
                                                            name={t('fri')} onUpdate={() => this.toggleWorkDay('fri')}/>
                                                  <Checkbox reverse value={this.state.model.workDays.includes('sat')}
                                                            name={t('sat')} onUpdate={() => this.toggleWorkDay('sat')}/>
                                                  <Checkbox reverse value={this.state.model.workDays.includes('sun')}
                                                            name={t('sun')} onUpdate={() => this.toggleWorkDay('sun')}/>
                                              </div>

                                              <div className={'flex'} style={{marginTop: 16}}>
                                                  <Checkbox reverse name={t('woWeekend')}
                                                            value={this.state.model.workDays.length === 7}
                                                            onUpdate={this.setAllWorkDays}/>
                                              </div>
                                          </div>
                                      </div>

                                      <div className={css.btnContainer}>
                                          <Button className={css.backBtn}
                                                  color={'tertiary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                              <Icon name={'arrow_left'}/>
                                              {t('back')}
                                          </Button>

                                          <Button isDisabled={this.validateStep(this.state.step)}
                                                  className={css.proceedBtn}
                                                  color={'secondary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                              {t('pass')}
                                              <Icon name={'arrow_right'}/>
                                          </Button>
                                      </div>
                                  </div>),
                                  (<div className={css.stepBody}>
                                      <h2>{t('uploadSalonPhotos')}</h2>

                                      <div bp={'grid 6 3@md'}>
                                          {this.state.model.photos.map((photo, i) =>
                                              <ImageInput url={photo} onUpload={url => this.setPhoto(i, url)} key={i}/>
                                          )}
                                          {this.state.model.photos.length < 12 &&
                                              <MockImageInput onClick={this.addPhotoInput}/>}
                                      </div>

                                      <div className={css.btnContainer}>
                                          <Button className={css.backBtn}
                                                  color={'tertiary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                              <Icon name={'arrow_left'}/>
                                              {t('back')}
                                          </Button>

                                          <Button isDisabled={this.validateStep(this.state.step)}
                                                  className={css.proceedBtn}
                                                  color={'secondary'}
                                                  onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                              {t('pass')}
                                              <Icon name={'arrow_right'}/>
                                          </Button>
                                      </div>
                                  </div>),
                                  (<div className={css.stepBody}>
                                      <h2>{t('addingSalonMaster')}</h2>

                                      {this.state.model.masters.map((master, i) =>
                                          <div key={i}>
                                              <h3 style={{margin: '12px 0'}}>{t('masterCharacteristics')}</h3>

                                              <div bp={'grid'} style={{gap: 24}}>
                                                  <div bp={'12 4@md'}>
                                                      <TextInput
                                                          onUpdate={val => this.setMasterField(i, 'name', val)}
                                                          value={this.state.model.masters[i].name}
                                                          style={{marginBottom: 6}}
                                                          label={t('nickname')}
                                                          placeholder={t('enterMastersWorkingNickname')}/>

                                                      <TextInput
                                                          onUpdate={val => this.setMasterParam(i, 'height', val)}
                                                          value={this.state.model.masters[i].characteristics.height}
                                                          style={{marginBottom: 6}}
                                                          label={capitalize(t('height'))}
                                                          type={'number'}
                                                          min={70}
                                                          max={250}
                                                          placeholder={t('enterMastersHeight')}/>

                                                      <TextInput
                                                          onUpdate={val => this.setMasterParam(i, 'weight', val)}
                                                          value={this.state.model.masters[i].characteristics.weight}
                                                          style={{marginBottom: 6}}
                                                          label={capitalize(t('weight'))}
                                                          type={'number'}
                                                          min={30}
                                                          max={150}
                                                          placeholder={t('enterMastersWeight')}/>

                                                      <TextInput
                                                          onUpdate={val => this.setMasterParam(i, 'age', val)}
                                                          value={this.state.model.masters[i].characteristics.age}
                                                          style={{marginBottom: 6}}
                                                          label={capitalize(t('age'))}
                                                          type={'number'}
                                                          min={18}
                                                          max={99}
                                                          placeholder={t('enterMastersAge')}/>
                                                  </div>

                                                  <div bp={'12 4@md'}>
                                                      <RadioGroup onUpdate={val => this.setMasterParam(i, 'eyes', val)}
                                                                  name={t('eyes')} rootBp={'grid 4'}
                                                                  containerStyle={{gap: 0}}
                                                                  value={this.state.model.masters[i].characteristics.eyes}
                                                                  options={["голубые", "синие", "зеленые", "карие", "серые", "черные", "желтые", "другие"].map(i => ({
                                                                      label: i,
                                                                      value: i
                                                                  }))}/>
                                                      <RadioGroup onUpdate={val => this.setMasterParam(i, 'bust', val)}
                                                                  name={capitalize(t('bust'))} rootBp={'grid 4'}
                                                                  containerStyle={{gap: 0}}
                                                                  value={this.state.model.masters[i].characteristics.bust}
                                                                  options={[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5].map(i => ({
                                                                      label: String(i),
                                                                      value: String(i)
                                                                  }))}/>
                                                  </div>
                                                  <div bp={'12 4@md'}>
                                                      <RadioGroup onUpdate={val => this.setMasterParam(i, 'hair', val)}
                                                                  name={t('hairColor')} rootBp={'grid 4'}
                                                                  containerStyle={{gap: 0}}
                                                                  value={this.state.model.masters[i].characteristics.hair}
                                                                  options={["брюнетка", "блондинка", "седая", "русая", "рыжая", "шатенка", "другая"].map(i => ({
                                                                      label: i,
                                                                      value: i
                                                                  }))}/>
                                                  </div>

                                                  {master.photos.map((photo, j) =>
                                                      <div bp={'6 2@md'} key={j}><ImageInput url={photo}
                                                                                             onUpload={url => this.setMasterPhoto(i, j, url)}/>
                                                      </div>
                                                  )}
                                                  {master.photos.length < 12 &&
                                                      <div bp={'6 2@md'}><MockImageInput
                                                          onClick={() => this.addMasterPhotoInput(i)}/>
                                                      </div>}
                                              </div>
                                          </div>
                                      )}

                                      <div className={cnb('flex wrap gap-12', css.multipleButtonContainer)}>
                                          {(this.state.model.kind === 'salon' && this.state.model.masters.length < 40) &&
                                              <div className={css.addMasterBtnContainer}><Button
                                                  className={css.addMasterBtn}
                                                  color={'primary'}
                                                  onClick={this.addAnotherMaster}>
                                                  {t('addAnotherMaster')}
                                              </Button></div>}

                                          <div className={css.btnContainer}>
                                              <Button className={css.backBtn}
                                                      color={'tertiary'} style={{marginTop: 0}}
                                                      onClick={() => this.stepChangeHandler(this.state.step - 1)}>
                                                  <Icon name={'arrow_left'}/>
                                                  {t('back')}
                                              </Button>

                                              <Button isDisabled={this.validateStep(this.state.step)}
                                                      className={css.proceedBtn}
                                                      color={'secondary'}
                                                      onClick={() => this.stepChangeHandler(this.state.step + 1)}>
                                                  {t('pass')}
                                                  <Icon name={'arrow_right'}/>
                                              </Button>
                                          </div>
                                      </div>
                                  </div>),
                                  (<div className={css.stepBody}>
                                      <h2>{t('checkDataCorrectness')}</h2>

                                      <div bp={'grid'} style={{gap: 32}}>
                                          <div bp={'12 6@md'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('commonInfo')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(0)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}}>
                                                  <TextInput style={{marginBottom: 12}} disabled
                                                             label={t(this.state.model.kind === 'salon' ? 'salonName' : 'yourNickname')}
                                                             placeholder={t(this.state.model.kind === 'salon' ? 'howYourSalonNamed' : 'enterYourWorkNickname')}
                                                             value={this.state.model.name}/>
                                                  <Select disabled style={{marginBottom: 12}}
                                                          options={this.state.prefetched.regions} label={t('city')}
                                                          placeholder={t('inWhichCity')}
                                                          value={this.state.model.region}/>
                                                  <TextInput disabled style={{marginBottom: 12}}
                                                             label={t('streetAndAddress')}
                                                             placeholder={t('salonAddress')}
                                                             value={this.state.model.address}/>
                                                  <TextInput disabled label={t('phone')} type={'phone'}
                                                             placeholder={t('typeYourPhoneNumber')}
                                                             value={this.state.model.phone}/>
                                              </div>
                                          </div>

                                          <div bp={'12 6@md'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('socialMedia')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(1)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}}>
                                                  {this.state.model.social.vk &&
                                                      <TextInput disabled style={{marginBottom: 12}} label={t('vkFull')}
                                                                 placeholder={'https://vk.com/'}
                                                                 value={this.state.model.social.vk}/>}

                                                  {this.state.model.social.inst &&
                                                      <TextInput disabled style={{marginBottom: 12}}
                                                                 label={t('instagram')}
                                                                 placeholder={'https://instagram.com/'}
                                                                 value={this.state.model.social.inst}/>}

                                                  {this.state.model.social.tgCh &&
                                                      <TextInput disabled style={{marginBottom: 12}}
                                                                 label={t('tgChannel')}
                                                                 placeholder={'https://t.me/'}
                                                                 value={this.state.model.social.tgCh}/>}

                                                  {this.state.model.social.ws &&
                                                      <TextInput disabled label={t('site')} placeholder={'https://'}
                                                                 value={this.state.model.social.ws}/>}
                                              </div>
                                          </div>

                                          <div bp={'12 6@md'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('serviceAndServices')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(2)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}}>
                                                  <span className={css.caption}>{t('youDoMassage')}</span>

                                                  <div className="flex wrap gap-12"
                                                       style={{marginTop: 12, marginBottom: 16}}>
                                                      {this.state.prefetched.leads.filter(i => this.state.model.leads.includes(i._id)).map((lead, i) =>
                                                          <Tag label={lead.name} icon={lead.icon} key={i}/>
                                                      )}
                                                  </div>

                                                  <span className={css.caption}>{t('services')}</span>

                                                  <div className="flex wrap gap-12" style={{marginTop: 12}}>
                                                      {this.state.prefetched.services.filter(i => this.state.model.services.includes(i._id)).map((service, i) =>
                                                          <Tag label={service.name} icon={service.icon} key={i}/>
                                                      )}
                                                  </div>
                                              </div>
                                          </div>

                                          <div bp={'12 6@md'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('messengers')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(2)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}}>
                                                  {this.state.model.messengers.tg &&
                                                      <TextInput disabled style={{marginBottom: 12}} label={t('tg')}
                                                                 placeholder={'@'}
                                                                 value={this.state.model.messengers.tg}/>}

                                                  {this.state.model.messengers.wa &&
                                                      <TextInput disabled type={'phone'} label={t('whatsapp')}
                                                                 placeholder={'+7'}
                                                                 value={this.state.model.messengers.wa}/>}
                                              </div>
                                          </div>

                                          <div bp={'12'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('massageTypes')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(3)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}} bp={'grid 12 4@md'}>
                                                  {this.state.model.programs.filter(i => i.enabled).map((program, i) =>
                                                      <Program key={i} title={program.name}
                                                               description={program.description}
                                                               price={program.cost || 0} duration={program.duration}
                                                               classicCnt={program.classicCnt}
                                                               eroticCnt={program.eroticCnt}
                                                               relaxCnt={program.relaxCnt}/>
                                                  )}
                                              </div>
                                          </div>

                                          <div bp={'12'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('workSchedule')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(4)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}}>
                                                  <div bp={'grid'} style={{gap: 24}}>
                                                      <div bp={'12 3@md'}>
                                                          <p style={{marginBottom: 12}}>{t('workDays')}</p>

                                                          <div className="flex wrap gap-12">
                                                              {this.state.model.workDays.map((day, i) =>
                                                                  <Tag label={t(day)} key={i}/>
                                                              )}
                                                          </div>

                                                          <p style={{
                                                              marginBottom: 12,
                                                              marginTop: 24
                                                          }}>{t('holidays')}</p>

                                                          <div className="flex wrap gap-12">
                                                              {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].filter(i => !this.state.model.workDays.includes(i)).map((day, i) =>
                                                                  <Tag label={t(day)} key={i}/>
                                                              )}
                                                          </div>
                                                      </div>

                                                      <div bp={'12 5@md'}>
                                                          <p style={{marginBottom: 12}}>{t('workHours')}</p>

                                                          <div className="flex wrap gap-12">
                                                              <Select disabled
                                                                      value={this.state.model.workHours.from}
                                                                      label={t('opening')} options={workHours}
                                                                      placeholder={''}/>
                                                              <Select disabled
                                                                      value={this.state.model.workHours.to}
                                                                      label={t('closing')}
                                                                      options={workHours}
                                                                      placeholder={''}/>
                                                          </div>

                                                          <div className={'flex'} style={{marginTop: 16}}>
                                                              <Checkbox disabled reverse
                                                                        value={this.state.model.workHours.roundclock}
                                                                        name={t('roundclock')}/>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>

                                          {this.state.model.kind === 'salon' && <div bp={'12'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('salonPhotos')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(5)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div bp={'grid 6 3@md'} style={{padding: 16}}>
                                                  {this.state.model.photos.map((photo, i) =>
                                                      <div className={css.img} key={i} style={{
                                                          backgroundImage: `url(${photo})`
                                                      }}>&nbsp;</div>
                                                  )}
                                              </div>
                                          </div>}

                                          <div bp={'12'}>
                                              <div className={css.sectionHead}>
                                                  <h3>{t('salonMasters')}</h3>
                                                  <Icon onClick={() => this.stepChangeHandler(6)}
                                                        className={css.editIcon} name={'edit'}/>
                                              </div>
                                              <div style={{padding: 16}}>
                                                  {this.state.model.masters.map((master, i) =>
                                                      <div key={i} className={css.finalMasterCard}>
                                                          <div bp={'grid 12 6@md'} style={{gap: '8px 32px'}}>

                                                              <TextInput
                                                                  disabled={this.state.model}
                                                                  value={master.name}
                                                                  placeholder={''}
                                                                  label={t('nickname')}/>

                                                              <TextInput
                                                                  disabled
                                                                  value={master.characteristics.height}
                                                                  label={capitalize(t('height'))}
                                                                  placeholder={''}
                                                                  type={'number'}/>

                                                              <TextInput
                                                                  disabled
                                                                  value={master.characteristics.weight}
                                                                  label={capitalize(t('weight'))}
                                                                  type={'number'}
                                                                  placeholder={''}/>

                                                              <TextInput
                                                                  disabled
                                                                  value={master.characteristics.age}
                                                                  label={capitalize(t('age'))}
                                                                  type={'number'}
                                                                  placeholder={''}/>

                                                              <TextInput
                                                                  disabled
                                                                  value={master.characteristics.eyes}
                                                                  label={capitalize(t('eyeColor'))}
                                                                  placeholder={''}/>

                                                              <TextInput
                                                                  disabled
                                                                  value={master.characteristics.hair}
                                                                  label={capitalize(t('hairColor'))}
                                                                  placeholder={''}/>

                                                              <TextInput
                                                                  disabled
                                                                  value={master.characteristics.bust}
                                                                  label={capitalize(t('bust'))}
                                                                  placeholder={''}/>
                                                          </div>

                                                          <div bp={'grid 6 2@md'} style={{marginTop: 12}}>
                                                              {master.photos.map((photo, i) =>
                                                                  <div className={css.img} key={i} style={{
                                                                      backgroundImage: `url(${photo})`
                                                                  }}>&nbsp;</div>
                                                              )}
                                                          </div>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      </div>

                                      <Button className={css.proceedBtn}
                                              color={'secondary'} style={isMobile ? {width: '100%'} : {}}
                                              onClick={() => this.submitForm()}>
                                          {t('finish')}
                                          <Icon name={'arrow_right'}/>
                                      </Button>
                                  </div>)
                              ]}/>}
        </div>
    }
}

export default withRouter(NewSalonPage)
