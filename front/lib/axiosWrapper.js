import axios from "axios"
import qs from "qs"

const sessionTTL = 36000000 // 10 hours

function sleep (ms) {
    return new Promise((resolve) => {
        setTimeout(()=> resolve(), ms)
    })
}

function straight (value) {
    return value
}

function networkErrorResponse () {
    return {
        data: {
            success: false,
            networkError: true
        }
    }
}

class Axios
{
    constructor(options) {
        let auth = options.auth 
        options.auth = undefined 
        this.axios = axios.create(options)
        this.delay = Math.max(options.delay ?? 0, 50)
        this.authFormatter = options.authFormatter || options.formatAuth || straight
        this.refreshURL = options.refreshURL
        this.onRefresh = options.onRefresh
        this.auth = { }
        this.cache = { }

        if (auth) {
            this.setAuth(auth)
        }
    }

    async request(options) {
        let now = new Date().valueOf()
        let expiresAt = new Date(this.auth?.expiresAt || 0).valueOf()
        if (this.auth && (now > expiresAt) && (now - expiresAt < sessionTTL / 2)) await this.refresh()

        await sleep(this.delay)
        options.headers ??= { }
        options.headers["Authorization"] = this.authFormatter(this.auth)

        let requestKey = `${options.url}?${qs.stringify(options.params)}` 

        if ((options.method?.toLowerCase() == "get") && (options.cacheTTL && options.cacheTTL > 0)) {
            let cachedResult = this.cache[requestKey]
            if (cachedResult && (cachedResult.expiresAt > now)) return cachedResult
        }

        try {
            let result = await this.axios.request(options)
            if ((options.method?.toLowerCase() == "get") && (options.cacheTTL && options.cacheTTL > 0)) {
                result.expiresAt = now + options.cacheTTL
                this.cache[requestKey] = result
            }
            return result
        }
        catch (error) {
            if (error.code == "ERR_NETWORK") {
                return networkErrorResponse()
            }
            else {
                throw error
            }
        }
    }

    setAuth(auth) {
        this.auth = auth
    }

    async refresh() {
        await sleep(this.delay)
        let result = await this.axios.request({
            method: "post",
            url: this.refreshURL,
            headers: {
                "Authorization": this.authFormatter(this.auth)
            }
        })
        if (this.onRefresh instanceof Function) {
            this.onRefresh(result.data.session)
        }
    }
}

function axiosWrapper (options) {
    let axiosInstance = new Axios(options)
    return {
        get axios() {
            return axiosInstance
        },
        install(app) {
            app.config.globalProperties.$axios = axiosInstance
        }
    }
}

export { 
    sessionTTL,
    axiosWrapper
}
