import { h } from "vue"

const welcomeVersion = 1 
const welcomeText = "This site uses Local Storage in your browser to save necessary data, "
                  + "such as Session and User id.\n"
                  + "It may work incorrectly if you use Incognito Mode, or if you disallow " 
                  + "sites to persist Cookies, or if you disallow Local Storage.\n"
                  + "Please do not share your sensitive information such as credit card info or passwords.\n"
                  + "Please be careful when following hyperlinks in biographies or event description texts, " 
                  + "it is on your own risk."

export default {
    computed: {
        showWelcome() {
            return (this.$storage.dismissWelcome ?? 0) < welcomeVersion
        }
    },
    methods: {
        dismiss() {
            this.$storage.dismissWelcome = welcomeVersion
        }
    },
    render() {
        return this.showWelcome?
        h("div", { class: ["modal-wrapper"] }, [
            h("div", { class: ["width-container", "pad-1"] }, [
                h("div", { class: ["modal-window", "card-card", "pad-1"] }, [
                    h("h3", { class: ["mar-b-1"] }, "Welcome!"),
                    h("p", { class: ["mar-b-2", "text-pre-wrap"] }, welcomeText),
                    h("div", { class: ["flex-stripe"] }, [
                        h("span", { class: ["flex-grow"] }, " "),
                        h("button", { class: ["button", "button-1"], onClick: ()=> this.dismiss() }, "Understandable")
                    ])
                ])
            ])
        ]) : null
    }
}
