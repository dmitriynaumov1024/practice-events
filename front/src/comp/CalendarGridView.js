import { h } from "vue"
import { ymdToDate, getDaysIn, calendarDayOf, dayOfWeekOf, daysOfWeek } from "@lib/dateTimeUtils.js"

export default {
    props: {
        year: Number,
        month: Number,
        items: Array
    },
    computed: {
        grid() {
            if (!this.items) return []

            let year = this.year, 
                month = this.month,
                startDay = 1, 
                endDay = getDaysIn(year, month)

            let result = []
            let week = []

            let date = ymdToDate(year, month, startDay)
            let calendarDay = calendarDayOf(date)

            for (let d=0; d<dayOfWeekOf(date); d+=1) {
                week.push({
                    day: "  ",
                    count: 0,
                    markerSize: 0
                })
            }

            for (let day=startDay; day<=endDay; day+=1) {
                if (week.length == 7) {
                    result.push(week)
                    week = []
                }
                let count = this.items.find(item => item.calendarDay == calendarDay)?.count || 0
                week.push({
                    day: String(day).padStart(2, "0"),
                    count: count,
                    markerSize: (count > 0)? (50 * Math.sqrt(count)/Math.sqrt(this.maxCount) + 10) : 0
                })
                calendarDay += 1
            }

            while (week.length < 7) {
                week.push({
                    day: "  ",
                    count: 0,
                    markerSize: 0
                })
            }
            result.push(week)

            return result
        },
        maxCount() {
            return this.items.map(item => Number(item.count) || 0)
                             .reduce((prev, next)=> Math.max(prev, next), 10)
        }
    },
    render() {
        return h("div", { class: [ "card-card", "pad-05" ] }, [ 
            h("div", { class: [ "flex-stripe", "pad-025", "text-mono", "mar-b-1" ] }, daysOfWeek.map(day => {
                return h("div", { class: [ "flex-grow", "text-center", "text-gray" ] }, day)
            })),
            h("div", { }, this.grid.map(week => {
                return h("div", { class: [ "flex-stripe", "pad-025", "text-mono", "mar-b-05" ] }, week.map(day => {
                    return h("div", { title: day.count ? `${day.count} events` : undefined, class: [ "pad-025", "flex-grow", "text-center", "clickable" ], onClick: ()=> this.$router.patchQuery({ day: day.day }) }, [
                        h("span", { }, `${day.day}`),
                        h("svg", { viewBox: "0 0 10 10", width: day.markerSize, style: { position: "absolute", display: "block", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 0.2 } }, [
                            h("circle", { cx: 5, cy: 5, r: 4.5, fill: "var(--color-warn)" })
                        ])
                    ])
                }))
            }))
        ]) 
    }
}
