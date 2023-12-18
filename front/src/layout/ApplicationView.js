import { h } from "vue"
import { RouterLink, RouterView } from "vue-router"

import WelcomeModal from "@/comp/WelcomeModal.js"

export default {
    render() {
        return [
            h("header", { class: [ "header" ] }, [
                h("div", { class: [ "width-container", "flex-stripe", "pad-05", "flex-pad-05" ] }, [
                    h("img", { class: [ "icon-2" ], src: "/icon/favicon.svg" }),
                    h(RouterLink, { to: "/" }, ()=> [ 
                        h("p", { class: [ "text-h2" ] }, "催しの広告板~")
                    ]),
                    h("span", { class: [ "flex-grow" ] }, " "),
                    h(RouterLink, { to: "/profile/login" }, ()=> [
                        h("img", { class: [ "icon-2" ], src: "/icon/profile-mini.svg" })
                    ])
                ])
            ]),
            h("main", {  }, [
                h("div", { class: [ "width-container", "pad-1" ] }, [
                    h(RouterView)
                ]),
                h(WelcomeModal)
            ]),
            h("footer", { class: [ "footer", "pad-1" ] }, [
                h("div", { class: [ "width-container", "pad-1" ] }, [
                    h("p", "© Events"), 
                    h("p", "© 2023 – Dmitriy Naumov")
                ])
            ])
        ]
    }
}
