import React from "react"
import PropTypes from "prop-types"
import css from '../../styles/kit/textsection.module.scss'
import {GlobalContext} from "../../contexts/Global.js";
import {cnb} from "cnbuilder";

class TextSection extends React.Component {
    lineHeight = 24

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            textRef: React.createRef(),
            showMoreRef: React.createRef(),
            needsShowMoreButton: false,
        }

        this.toggle = this.toggle.bind(this)
    }

    componentDidMount() {
        const needsShowMoreButton = this.state.textRef.current?.scrollHeight >= this.lineHeight * this.props.lines

        this.setState({
            needsShowMoreButton
        })
    }

    static propTypes = {
        lines: PropTypes.number,
        style: PropTypes.object,
        dangerouslySetInnerHTML: PropTypes.object
    }

    static defaultProps = {
        lines: 7,
        style: {},
        dangerouslySetInnerHTML: undefined
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        const {theme} = this.context

        return <div className={css['theme--' + theme]}>
            <section className={cnb(css.text, this.props.className)} style={this.props.style}>
                <div dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML} ref={this.state.textRef} style={{
                    lineHeight: this.lineHeight + 'px',
                    maxHeight: this.state.isOpen ? this.state.textRef.current?.scrollHeight : this.lineHeight * this.props.lines,
                    marginBottom: this.state.needsShowMoreButton ? 16 : 0
                }}>
                    {this.props.children}
                </div>
                {this.state.needsShowMoreButton && <a className={css.showMore}
                                                          onClick={this.toggle}>{this.state.isOpen ? this.context.t('showLess') : this.context.t('showMore')}</a>}
            </section>
        </div>
    }
}

TextSection.contextType = GlobalContext

export default TextSection
