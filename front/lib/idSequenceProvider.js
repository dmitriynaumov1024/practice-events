function idSequenceProvider() {
    let id = 0
    let idSequence = {
        next() {
            id += 1
            return id
        }
    }
    return {
        install(app, options) {
            app.config.globalProperties.$idSequence = idSequence
        }
    }
}

export {
    idSequenceProvider
}
