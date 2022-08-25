import React from "react";
import PropTypes from "prop-types";
import {GlobalContext} from "../../contexts/Global.js";
import {DateTime} from "luxon";
import css from '../../styles/kit/weekview.module.scss'
import {cnb} from "cnbuilder";

export default class WeekView extends React.Component {
    static contextType = GlobalContext

    static propTypes = {
        enabledDays: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    render() {
        const monDate = DateTime.now().startOf('week'),
            {theme} = this.context,
            currentDayOfMonth = DateTime.now().day,
            weekDays = {
                mon: 0,
                tue: 1,
                wed: 2,
                thu: 3,
                fri: 4,
                sat: 5,
                sun: 6,
            },
            enabledDays = this.props.enabledDays.map(dayName => {
                return weekDays[dayName]
            })

        return <div className={css['theme--' + theme]}>
            <div className={cnb('flex', 'non-selectable', css.root)}>
                {(new Array(7)).fill('').map((day, dayIndex) => {
                    const dayDate = monDate.plus({days: dayIndex})

                    return <div
                        className={cnb(css.dayOfMonth, enabledDays.includes(dayIndex) ? css.enabled : css.disabled, dayDate.day === currentDayOfMonth ? css.today : '')}
                        key={dayIndex}>
                        <span>{dayDate.toFormat('EEE')}</span>
                        <div>{dayDate.day}</div>
                    </div>
                })}
            </div>
        </div>
    }
}
