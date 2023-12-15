class Worker 
{
    async start() {
        await this.init()
        this._intervalId = setInterval(()=> this.action(), this.interval)
    } 

    async stop() {
        clearInterval(this._intervalId)
    }
}

export {
    Worker
}
