import qs from "qs"
import { createApp } from "vue"
import { createWebHistory } from "vue-router"
import { routerWrapper } from "@lib/routerWrapper.js"
import { axiosWrapper } from "@lib/axiosWrapper.js"
import { storageProvider } from "@lib/storageProvider.js"
import { timerProvider } from "@lib/timerProvider.js"
import { idSequenceProvider } from "@lib/idSequenceProvider.js"

import routes from "./routing.js"
import ApplicationView from "@/layout/ApplicationView.js"

export default class VueApplication
{
    constructor() {
        this.storage = storageProvider({
            id: "events-app"
        })
        this.router = routerWrapper({
            history: createWebHistory(),
            routes: routes
        })
        this.axios = axiosWrapper({
            baseURL: "http://localhost:8000",
            validateStatus: ()=> true,
            formatAuth: (auth)=> qs.stringify(auth),
            auth: this.storage.storage.session,
            refreshURL: "/auth/refresh",
            onRefresh: (session) => {
                this.axios.axios.setAuth(session)
                this.storage.storage.session = session
                if (!session) {
                    this.storage.storage.person = undefined
                }
            }
        })
        this.timer = timerProvider({
            interval: 10000
        })
        this.idSequence = idSequenceProvider()
        this.app = createApp(ApplicationView)
        this.app.use(this.storage)
        this.app.use(this.router)
        this.app.use(this.axios)
        this.app.use(this.timer)
        this.app.use(this.idSequence)
    }

    mount(...args) {
        this.app.mount(...args)
    }
}
