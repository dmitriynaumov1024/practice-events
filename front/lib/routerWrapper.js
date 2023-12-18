import { createRouter } from "vue-router"

function routerWrapper(options) {
    let router = createRouter(options)
    router.patchQuery = function (newQuery) {
        let { path, query } = this.currentRoute.value
        query = Object.assign({ }, query)
        query = Object.assign(query, newQuery)
        this.push({ path, query })
    }
    return router
}

export {
    routerWrapper
}
