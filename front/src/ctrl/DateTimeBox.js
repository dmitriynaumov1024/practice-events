import { h } from "vue"

import { getDaysIn } from "@lib/dateTimeUtils.js"

function clamp (value, min, max) {
    value = Number.parseInt(value)
    if (Number.isNaN(value) || value < min) return min
    if (value > max) return max
    return value
}

function pad (value, size, filling) {
    return String(value).padStart(size, filling)
}

function replace (value, start, end, replacement) {
    return value?.slice(0, start) + replacement + value?.slice(end)
}

export default {
    props: {
        value: String
    },
    emits: [
        "update"
    ],
    data() {
        return {
            id: "input-" + this.$idSequence.next(),
        }
    },
    computed: {
        year() {
            return this.value?.slice(0, 4)
        },
        month() {
            return this.value?.slice(5, 7)
        },
        day() {
            return this.value?.slice(8, 10)
        },
        hour() {
            return this.value?.slice(11, 13)
        },
        minute() {
            return this.value?.slice(14, 16)
        }
    },
    methods: {
        // yyyy-mm-ddThh:mm:ss
        updateYear () {
            let year = clamp(this.$refs.yearInput.value, 0, 9999)
            this.$emit("update", replace(this.value, 0, 4, pad(year, 4, "0")))
        },
        updateMonth () {
            let month = clamp(this.$refs.monthInput.value, 1, 12)
            month = clamp(month, 1, 12)
            this.$emit("update", replace(this.value, 5, 7, pad(month, 2, "0")))
        },
        updateDay () {
            let day = clamp(this.$refs.dayInput.value, 1, getDaysIn(this.year ?? 0, this.month ?? 1))
            this.$emit("update", replace(this.value, 8, 10, pad(day, 2, "0")))
        },
        updateHour () {
            let hour = clamp(this.$refs.hourInput.value, 0, 23)
            this.$emit("update", replace(this.value, 11, 13, pad(hour, 2, "0")))
        },
        updateMinute () {
            let minute = clamp(this.$refs.minuteInput.value, 0, 59)
            this.$emit("update", replace(this.value, 14, 16, pad(minute, 2, "0")))
        }
    },
    render() {
        return h("div", { class: ["fancy-input"] }, [
            h("label", { for: this.id, class: ["text-gray"] }, this.$slots.label()),
            h("div", { id: this.id, class: ["input", "flex-stripe", "text-mono", "text-center"] }, [
                h("input", { ref: "yearInput", class: ["super-inline"], style: { width: "3rem" }, 
                             placeholder: "YYYY", maxlength: 4, value: this.year, onChange: this.updateYear }),
                h("span", { class: ["text-mono"] }, " - "),
                h("input", { ref: "monthInput", class: ["super-inline"], style: { width: "1.5rem" }, 
                             placeholder: "MM", maxlength: 2, value: this.month, onChange: this.updateMonth }),
                h("span", { }, " - "),
                h("input", { ref: "dayInput", class: ["super-inline"], style: { width: "1.5rem" }, 
                             placeholder: "DD", maxlength: 2, value: this.day, onChange: this.updateDay }),
                h("span", { }, " , "),
                h("input", { ref: "hourInput", class: ["super-inline"], style: { width: "1.5rem" }, 
                             placeholder: "hh", maxlength: 2, value: this.hour, onChange: this.updateHour }),
                h("span", { }, " : "),
                h("input", { ref: "minuteInput", class: ["super-inline"], style: { width: "1.5rem" }, 
                             placeholder: "mm", maxlength: 2, value: this.minute, onChange: this.updateMinute }),
                h("span", { }, " UTC"),
                h("span", { class: ["flex-grow"] }, " "),
            ])
        ])
    }
}
