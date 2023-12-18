import { reactive } from "vue"

function timerProvider (options = { }) {
    let interval = options?.interval ?? 10000
    let timer = reactive({ time: new Date() })
    let timerUpdateInterval = null
    return {
        get timer() {
            return timer
        },
        install (app, options) {
            app.config.globalProperties.$timer = timer
            timerUpdateInterval = setInterval(()=> { timer.time = new Date() }, interval)
        }
    }
}

export {
    timerProvider
}
