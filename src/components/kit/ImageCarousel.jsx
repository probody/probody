import React from "react";
import PropTypes from "prop-types";
import css from '../../styles/kit/imagecarousel.module.scss';
import {cnb} from "cnbuilder";
import {GlobalContext} from "../../contexts/Global.js";
import {withRouter} from "next/router.js";
import Icon from "./Icon.jsx";

class ImageCarousel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSlide: 0,
            fullscreen: false,
            slider: React.createRef(),
            swipe: {
                started: false,
                startX: 0
            }
        }

        this.swipeHandlers.tap = this.swipeHandlers.tap.bind(this)
        this.swipeHandlers.release = this.swipeHandlers.release.bind(this)
        this.swipeHandlers.move = this.swipeHandlers.move.bind(this)
    }

    static contextType = GlobalContext

    static propTypes = {
        pics: PropTypes.arrayOf(PropTypes.string).isRequired,
        link: PropTypes.any,
        height: PropTypes.number,
        isPRO: PropTypes.bool
    }

    setSlide(index) {
        this.setState({currentSlide: index})

        this.state.slider.current.style.transform = `translateX(-${index * 100}%)`
    }

    swipeHandlers = {
        tap(e) {
            this.setState({
                swipe: {
                    started: true,
                    startX: e.touches ? e.touches[0].pageX : 0
                }
            })
        },
        release() {
            this.setState({
                swipe: {
                    ...this.state.swipe,
                    started: false
                }
            })

            this.state.slider.current.style.transform = `translateX(${-(this.state.currentSlide) * 100}%)`
        },
        move(e) {
            if (!this.state.swipe.started) {
                return
            }

            if (e.changedTouches) {
                e.movementX = (e.changedTouches[0].pageX - this.state.swipe.startX)

                // this.setState({
                //     swipe: {
                //         started: true,
                //         startX: e.changedTouches[0].pageX
                //     }
                // })
            }

            let currentTransform = String(this.state.slider.current.style.transform).replace(`translateX(`, '').replace(')', '') || '0px'

            if (currentTransform.endsWith('%')) {
                currentTransform = currentTransform.replace('%', '')
                currentTransform *= this.state.slider.current.clientWidth
                currentTransform /= 100
            } else {
                currentTransform = Number(currentTransform.replace('px', ''))
            }

            let transformAmount = e.movementX + currentTransform

            if (transformAmount > 0 || transformAmount < -this.state.slider.current.clientWidth * (this.props.pics.length - 1)) {
                return
            }

            const relativeTransform = this.state.slider.current.clientWidth * this.state.currentSlide + transformAmount

            if (relativeTransform < this.state.slider.current.clientWidth * -0.3 && e.movementX <= 0) {
                // console.log('swiped to next slide')
                this.state.slider.current.style.transform = `translateX(${-(this.state.currentSlide + 1) * 100}%)`

                return this.setState({
                    swipe: {
                        started: false
                    },
                    currentSlide: this.state.currentSlide + 1
                })
            } else if (relativeTransform > this.state.slider.current.clientWidth * 0.3 && e.movementX >= 0) {
                // console.log('swiped to prev slide')

                return this.setState({
                    swipe: {
                        started: false
                    },
                    currentSlide: this.state.currentSlide - 1
                })
            }

            this.state.slider.current.style.transform = `translateX(${transformAmount}px)`
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.fullscreen) {
            window.document.body.classList.add('no-scroll')
        } else if (prevState.fullscreen && !this.state.fullscreen) {
            window.document.body.classList.remove('no-scroll')
        }
    }

    render() {
        const {theme, isMobile, t} = this.context
        let height

        if (!this.props.height) {
            height = isMobile ? 250 : 350;
        } else {
            height = this.props.height
        }

        if (this.state.fullscreen) {
            height = isMobile ? '50vh' : '60vh'
        }

        return <div className={css['theme--' + theme]}>
            <div onClick={(e) => {
                if (e.target.classList.contains(css.backdrop)) {
                    this.setState({fullscreen: false})
                }
            }} className={cnb(css.backdrop, this.state.fullscreen ? css.visible : '')}></div>

            <div className={cnb(css.modal, this.state.fullscreen ? css.visible : '')}>
                <div className={cnb(this.props.className, 'overflow-hidden', 'relative')}>
                    {this.props.isPRO && <div className={css.proLabel}>
                        <Icon name={'pro'} />
                        <span>{t('pro')}</span>
                    </div>}

                    <div onMouseDown={this.swipeHandlers.tap} onTouchStart={this.swipeHandlers.tap}
                         onMouseLeave={this.swipeHandlers.release}
                         onMouseUp={this.swipeHandlers.release} onTouchEnd={this.swipeHandlers.release}
                         onMouseMove={this.swipeHandlers.move} onTouchMove={this.swipeHandlers.move}
                         ref={this.state.slider}
                         className={css.transformTransition}>
                        {this.props.pics.map((image, index) =>
                            <div className={css.slide} style={{
                                backgroundImage: `url(${this.props.pics[index]})`,
                                marginTop: index === 0 ? 0 : (typeof height === 'string' ? '-' + height : -height),
                                ...(this.state.fullscreen ? {} : {height}),
                                marginLeft: index * 100 + '%',
                                cursor: this.props.link ? 'pointer' : (this.state.fullscreen ? 'default' : 'zoom-in')
                            }} key={index} onClick={() => {
                                if (this.props.link) {
                                    return this.props.router.push(this.props.link)
                                }

                                this.setState({fullscreen: true})
                            }}>
                                &nbsp;
                            </div>
                        )}
                    </div>
                    {this.props.pics.length > 1 && <div className={css.navigation}>
                        {this.props.pics.map((image, index) =>
                            <div
                                className={cnb(css.navigationItem, index === this.state.currentSlide ? css.current : '')}
                                key={index}
                                onClick={() => this.setSlide(index)}>
                                &nbsp;
                            </div>
                        )}
                    </div>}
                </div>
            </div>
        </div>
    }
}

export default withRouter(ImageCarousel);
