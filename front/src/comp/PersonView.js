import { h } from "vue" 
import { RouterLink } from "vue-router"
import { formatDateTime } from "@lib/dateTimeUtils.js"

export default {
    props: {
        person: Object
    },
    render() {
        let person = this.person
        return h("div", { class: ["card"] }, [
            h("div", { class: ["mar-b-1"] }, [
                h("p", { class: ["text-gray", "mar-b-05"] }, "Name"),
                h("p", { class: ["text-bold"] }, person.name)
            ]),
            h("div", { class: ["mar-b-1"] }, [
                h("p", { class: ["text-gray", "mar-b-05"] }, "Email"),
                h("p", { }, person.email)
            ]),
            h("div", { class: ["mar-b-1"] }, [
                h("p", { class: ["text-gray", "mar-b-05"] }, "Biography"),
                h("p", { }, person.biography)
            ]),
            person.tags?.length ?
            h("div", { class: ["mar-b-1"] }, [
                h("p", { class: ["text-gray", "mar-b-05"] }, "Interested in"),
                h("p", { }, person.tags.map((tag) => [
                    h(RouterLink, { to: { path: "/event/list", query: { page: 1, tag: tag.tag } }, class: ["link"] }, ()=> `#${tag.tag}`),
                    " "
                ]))
            ]) : null,
            h("div", { class: ["mar-b-1"] }, [
                h("p", { class: ["text-gray", "mar-b-05"] }, "Created at"),
                h("p", { }, formatDateTime(this.person.createdAt))
            ])
        ])
    }
}
