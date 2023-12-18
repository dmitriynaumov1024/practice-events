import { h } from "vue"

import { getDaysIn } from "@lib/dateTimeUtils.js"

export default {
    props: {
        year: Number,
        month: Number,
        day: Number,
        page: Number,
        tag: String
    },
    methods: {
        yearMinus() {
            if (this.year <= 2000) return
            else this.$router.patchQuery({ year: this.year - 1 })
        },
        yearPlus() {
            if (this.year >= 3000) return 
            else this.$router.patchQuery({ year: this.year + 1 })
        },
        monthMinus() {
            if (this.year <= 2000 && this.month <= 1) return
            let year = this.year, month = this.month - 1
            if (month < 1) {
                month = 12
                year -= 1
            }
            this.$router.patchQuery({ year, month })
        },
        monthPlus() {
            if (this.year >= 3000) return 
            let year = this.year, month = this.month + 1
            if (month > 12) {
                month = 1
                year += 1
            }
            this.$router.patchQuery({ year, month })
        },
        dayMinus() {
            if (this.day <= 1) return
            else this.$router.patchQuery({ day: this.day - 1 })  
        },
        dayPlus() {
            if (this.day >= getDaysIn(this.year, this.month)) return
            else this.$router.patchQuery({ day: this.day + 1 })  
        },
        dayUnset() {
            this.$router.patchQuery({ day: undefined, page: undefined })
        },
        setTag() {
            let tag = this.$refs.tagInput.value.toLowerCase()
            if (!tag.length) tag = undefined
            if (tag != this.tag) this.$router.patchQuery({ tag })
        }
    },
    render() {
        return h("div", { class: [ "flex-stripe", "flex-wrap", "flex-pad-1", "mar-b-15" ] }, [
            h("div", { }, [
                h("p", { class: [ "text-gray", "pad-025" ] }, "Year"),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.yearMinus() }, "<"),
                h("button", { class: [ "button", "button-2" ] }, `${this.year}`),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.yearPlus() }, ">"),
            ]),
            h("div", { }, [
                h("p", { class: [ "text-gray", "pad-025" ] }, "Month"),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.monthMinus() }, "<"),
                h("button", { style: { width: "3rem" }, class: [ "button", "button-2" ] }, `${this.month}`),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.monthPlus() }, ">"),
            ]),
            this.day? 
            h("div", { }, [
                h("p", { class: [ "text-gray", "pad-025" ] }, "Day"),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.dayMinus() }, "<"),
                h("button", { style: { width: "3rem" }, class: [ "button", "button-2" ], onClick: ()=> this.dayUnset() }, `${this.day}`),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.dayPlus() }, ">")
            ]) : 
            h("div", { }, []),
            h("div", { }, [
                h("p", { class: [ "text-gray", "pad-025" ] }, "Event tag"),
                h("input", { type: "text", value: this.tag, ref: "tagInput", maxlength: 30, class: [ "button", "button-2" ], style: { width: "9rem", textAlign: "start" } }),
                h("button", { class: [ "button", "button-1" ], onClick: ()=> this.setTag() }, "Q")
            ])
        ])
    }
}