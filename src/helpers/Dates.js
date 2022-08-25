import {DateTime} from "luxon";

export default class Dates {
    static humanizeDuration(weekDays, locale) {
        return DateTime.fromFormat(weekDays[0], 'EEE', {locale: 'en'}).toFormat('ccc', {locale}) + "-" + DateTime.fromFormat(weekDays[weekDays.length - 1], 'EEE', {locale: 'en'}).toFormat('ccc', {locale});
    }

    static isOpen(workDays, workHours) {
        const currentDay = DateTime.now().toFormat('ccc', {locale: 'en'}).toLowerCase();

        if (!workDays.includes(currentDay)) {
            return false
        }

        if (workHours.roundclock) {
            return true
        }

        const startTime = DateTime.fromFormat(workHours.from, 'HH:mm').toMillis(),
            endTime = DateTime.fromFormat(workHours.to, 'HH:mm').toMillis(),
            currentTime = DateTime.now().toMillis();

        return currentTime >= startTime && currentTime <= endTime
    }
}
