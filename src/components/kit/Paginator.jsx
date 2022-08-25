import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import css from '../../styles/kit/paginator.module.scss';
import Button from "./Button.jsx";
import PropTypes from "prop-types";
import Icon from "./Icon.jsx";
import {cnb} from "cnbuilder";

export default class Paginator extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        page: PropTypes.number.isRequired,
        pageCnt: PropTypes.number,
        onChange: PropTypes.func
    }

    render() {
        const {theme, t, isMobile} = this.context

        const pages = [];

        if (isMobile) {
            if (this.props.pageCnt <= 3) {
                for (let i = 1; i <= this.props.pageCnt; i++) {
                    pages.push(i);
                }
            } else if ([1, 2, this.props.pageCnt].includes(this.props.page)) {
                pages.push(1, 2, '...', this.props.pageCnt)
            } else {
                pages.push(1, this.props.page, '...', this.props.pageCnt)
            }
        } else {
            if (this.props.pageCnt <= 14) {
                for (let i = 1; i <= this.props.pageCnt; i++) {
                    pages.push(i);
                }
            } else if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, this.props.pageCnt].includes(this.props.page)) {
                pages.push(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, '...', this.props.pageCnt)
            } else {
                pages.push(1, '...', this.props.page - 4, this.props.page - 3, this.props.page - 2, this.props.page - 1, this.props.page, this.props.page + 1, this.props.page + 2, this.props.page + 3, this.props.page + 4, '...', this.props.pageCnt)
            }
        }

        return <div className={css['theme--' + theme]} style={this.props.style}>
            <div className="flex justify-center" style={{gap: 6}}>
                <div>
                    <Button isDisabled={this.props.page === 1} className={css.btn} onClick={() => this.props.onChange(this.props.page - 1)} color={'tertiary'}>
                        <Icon name={'arrow_left'} style={{width: 18, height: 12, marginRight: isMobile ? 0 : 8}} />
                        {isMobile ? '' : t('backward')}
                    </Button>
                </div>
                <div className={cnb(css.pageList, theme === 'dark' ? css.bgSecondlayer : css.bgTertiary)}>
                    {pages.map(page =>
                        <div onClick={() => page !== '...' && this.props.onChange(page)} key={page} className={cnb(css.page, page === this.props.page ? css.current : '')}>{page}</div>
                    )}
                </div>
                <div>
                    <Button isDisabled={this.props.page === this.props.pageCnt} className={css.btn} onClick={() => this.props.onChange(this.props.page + 1)} color={'tertiary'}>
                        {isMobile ? '' : t('forward')}
                        <Icon name={'arrow_right'} style={{width: 18, height: 12, marginLeft: isMobile ? 0 : 8}} />
                    </Button>
                </div>
            </div>
        </div>
    }
}
