import React from "react";
import {GlobalContext} from "../../contexts/Global.js";
import css from '../../styles/kit/calendar.module.scss'
import PropTypes from "prop-types";
import {DateTime} from "luxon";
import Icon from "./Icon.jsx";
import {capitalize} from "../../helpers/String.js";
import {cnb} from "cnbuilder";

export default class Calendar extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        value: PropTypes.instanceOf(Date).isRequired,
        onUpdate: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            month: DateTime.now().startOf('month')
        }
    }


    render() {
        const {theme, t} = this.context,
            curDate = new Date,
            nextMonth = this.state.month.plus({months: 1}),
            prevMonth = this.state.month.minus({months: 1}),
            weekRows = [[], [], [], [], []],
            canGoBack = prevMonth.endOf('month').toMillis() > +curDate,
            canGoForward = nextMonth.toMillis() < DateTime.fromJSDate(curDate).plus({months: 6}).toMillis(),
            weekDays = [],
            isDayDisabled = (day, row) => {
                if (row === 0 && Number(day) > 20) {
                    return true
                }

                if (row === 4 && Number(day) < 10) {
                    return true
                }

                // noinspection RedundantIfStatementJS
                if (curDate.getMonth() + 1 === Number(this.state.month.toFormat('M')) && Number(day) < curDate.getDate()) {
                    return true
                }

                return false
            },
            isToday = day => {
                return curDate.getMonth() + 1 === Number(this.state.month.toFormat('M')) && curDate.getDate().toString() === day
            },
            isChecked = (day, row) => {
                if (Number(day) > 20 && row === 0) {
                    return false
                }

                if (Number(day) < 10 && row === 4) {
                    return false
                }

                const propDay = this.props.value.getDate(),
                    propMonth = this.props.value.getMonth() + 1

                return Number(day) === propDay && Number(this.state.month.toFormat('M')) === propMonth
            }

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            weekDays.push(this.state.month.startOf('week').plus({days: dayIndex}).toFormat('EEE'))
        }

        for (let week = 0; week < 5; week++) {
            const weekNumber = this.state.month.plus({weeks: week}).toFormat('W'),
                weekStart = DateTime.fromObject({
                    weekNumber
                })

            for (let day = 0; day < 7; day++) {
                weekRows[week].push(weekStart.plus({days: day}).toFormat('d'))
            }
        }

        return <div className={css['theme--' + theme]}>
            <div className={css.root}>
                <div className="flex justify-between">
                    <div className={cnb('cursor-pointer', canGoBack ? '' : css.disabled)} onClick={() => {
                        if (!canGoBack) {
                            return
                        }

                        this.setState({
                            month: prevMonth
                        })
                    }}>
                        <Icon name={'chevron_left'} className={css.chevron}/>
                        <span className="fw-normal"
                              style={{marginLeft: 12}}>{capitalize(prevMonth.toFormat('LLLL'))}</span>
                    </div>

                    <p className="subtitle2 fw-normal"
                       style={{lineHeight: '22px'}}>{capitalize(this.state.month.toFormat('LLLL'))}</p>

                    <div className={cnb('cursor-pointer', canGoForward ? '' : css.disabled)} onClick={() => {
                        if (!canGoForward) {
                            return
                        }

                        this.setState({
                            month: nextMonth
                        })
                    }}>
                            <span className="fw-normal"
                                  style={{marginRight: 12}}>{capitalize(nextMonth.toFormat('LLLL'))}</span>
                        <Icon name={'chevron_right'} className={css.chevron}/>
                    </div>
                </div>

                <table className={css.tableRoot}>
                    <thead>
                    <tr>
                        {weekDays.map((day, i) =>
                            <th key={i}>{day}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {weekRows.map((week, i) =>
                        <tr key={i}>
                            {week.map((day, j) =>
                                <td key={j}>
                                    <div
                                        className={cnb(css.day, isToday(day) ? css.today : '', isDayDisabled(day, i) ? css.disabled : '', isChecked(day, i) ? css.checked : '')}
                                        onClick={() => !isDayDisabled(day, i) && this.props.onUpdate(this.state.month.plus({days: Number(day) - 1}).toJSDate())}
                                        key={j}>
                                        {day}
                                    </div>
                                </td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    }
}
