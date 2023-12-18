import { h } from "vue"
import { RouterLink } from "vue-router" 

let year = new Date().getFullYear()
let month = new Date().getMonth() + 1 

const CardLink = {
    props: {
        to: Object
    },
    render() {
        return h(RouterLink, { to: this.to, class: ["card-card", "container-1", "pad-05", "mar-b-1"] }, this.$slots.default)
    }
}

export default {
    render() {
        return h("div", { class: ["flex-gallery"] }, [
            h(CardLink, { to: { path: "/calendar", query: { year, month } } }, ()=> [
                h("img", { src: "/icon/calendar.svg", style: { width: "100%" } }),
                h("h3", { class: ["text-center"] }, "Calendar")
            ]),
            h(CardLink, { to: { path: "/tags", query: { page: 1 } } }, ()=> [
                h("img", { src: "/icon/discover.svg", style: { width: "100%" } }),
                h("h3", { class: ["text-center"] }, "Discover")
            ]),
            h(CardLink, { to: { path: "/event/list",  query: { page: 1 } } }, ()=> [
                h("img", { src: "/icon/event.svg", style: { width: "100%" } }),
                h("h3", { class: ["text-center"] }, "Events")
            ]),
            h(CardLink, { to: { path: "/profile/login" } }, ()=> [
                h("img", { src: "/icon/profile.svg", style: { width: "100%" } }),
                h("h3", { class: ["text-center"] }, "My profile")
            ])
            // h(RouterLink, { to: "/people?page=1", class: ["card-card", "pad-05", "mar-b-1"] }, ()=> [
            //     h("h3", { }, "People")
            // ])
        ])
    }
}
