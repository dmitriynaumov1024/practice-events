import { h } from "vue"

export default {
    data() {
        return {

        }
    },
    render() {
        return h("div", { }, [
            h("p", { }, [
                h("a", { href: "/" }, "plain <a>")
            ]),
            h("p", { }, [
                h("a", { href: "/", class: ["link"] }, "<a class=\"link\">")
            ])
        ])
    }
}
