import { h } from "vue"
import { RouterLink } from "vue-router"
import PersonView from "@/comp/PersonView.js"

export default {
    data() {
        return {
            person: null
        }
    },
    computed: {
        id() {
            return this.$storage.person?.id
        }
    },
    mounted() {
        this.$watch (
            ()=> [ this.id ],
            ()=> this.getProfile(),
            { immediate: true } 
        )
    },
    methods: {
        async getProfile() {
            if (!this.id) return
            let result = await this.$axios.request({
                method: "get",
                url: "/person/view",
                cacheTTL: 1000,
                params: { 
                    id: this.id
                }
            })
            if (result.data.person) {
                this.person = result.data.person
            }
        },
        async logout() {
            await this.$axios.request({
                method: "post",
                url: "/auth/logout"
            })
            this.$storage.person = null
            this.$storage.session = null
            this.$axios.setAuth({ })
            this.$router.push("/")
        }
    },
    render() {
        return [
            h("div", { class: ["flex-stripe", "mar-b-1"] }, [
                h("h3", { }, "My profile"),
                h("span", { class: ["flex-grow"] }, " "),
                h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.logout() }, "Log out")
            ]),
            this.person? [
                h(PersonView, { person: this.person }),
                h("div", { class: ["flex-stripe", "card", "pad-v-1" ] }, [
                    h("p", { }, "Edit profile"),
                    h(RouterLink, { to: "/profile/edit", class: ["button", "button-1"] }, ()=> "Edit")
                ]),
                h("div", { class: ["flex-stripe", "card", "pad-v-1" ] }, [
                    h("p", { }, "My events"),
                    h(RouterLink, { to: { path: "/event/list", query: { page: 1, owner: this.id } }, class: ["button", "button-1"] }, ()=> "See")
                ]),
                h("div", { class: ["flex-stripe", "card", "pad-v-1" ] }, [
                    h("p", { }, "My event visits"),
                    h(RouterLink, { to: { path: "/visit/list", query: { page: 1 } }, class: ["button", "button-1"] }, ()=> "See")
                ]),
                h("div", { class: ["flex-stripe", "card", "pad-v-1" ] }, [
                    h("p", { }, "My notifications"),
                    h(RouterLink, { to: { path: "/notification/list", query: { page: 1 } }, class: ["button", "button-1"] }, ()=> "See")
                ]),
            ] :
            h("p", { }, "Loading, please wait...")
        ]
    }
}
