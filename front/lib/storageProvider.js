import { reactive } from "vue"

function getStorage (id) {
    if (!id) return { }
    return JSON.parse(window.localStorage[id] ?? "{}")
}

function putStorage (id, storage) {
    if (!id) return
    window.localStorage[id] = JSON.stringify(storage)
}

function storageProvider (options = { }) {
    let storage = reactive(getStorage(options.id))
    window.addEventListener("unload", ()=> {
        putStorage(options.id, storage)
    })
    return {
        get storage() {
            return storage
        },
        install (app, options) {
            app.config.globalProperties.$storage = storage
        }
    }
}

export {
    storageProvider
}
