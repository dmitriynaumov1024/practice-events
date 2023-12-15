import express from "express"

// stolen from
// https://www.npmjs.com/package/async-error-catcher?activeTab=code
function catchErrors (func) {
    if (!(func instanceof Function)) {
        throw new Error("func must be instance of Function")
    }

    return function (req, res, next, ...rest) {
        let promise = func(req, res, next, ...rest)
        if (promise?.catch) promise.catch(err => next(err))
    }
}

const httpMethods = [ "all", "get", "post", "put", "patch", "delete" ]

class Router 
{
    constructor (router) {
        this.router = router || express.Router()
        for (let method of httpMethods) {
            this[method] = (path, handler) => {
                return this.router[method](path, catchErrors(handler))
            }
        }
    }

    use (handler) {
        return this.router.use(catchErrors(handler))
    }
}

class Application
{
    constructor(app) {
        this.app = app || express()
        this.listen = (...args) => this.app.listen(...args)
        for (let method of httpMethods) {
            this[method] = (path, handler) => {
                return this.app[method](path, catchErrors(handler))
            }
        }
    }

    use (...args) {
        if (args.length == 2) {
            let [ path, handler ] = args
            if (handler instanceof Router) {
                return this.app.use(path, handler.router)
            }
            else {
                return this.app.use(path, catchErrors(handler))
            }
        }
        if (args.length == 1) {
            let [ handler ] = args
            return this.app.use(catchErrors(handler))
        }
    }
}

export {
    Application,
    Router
}
