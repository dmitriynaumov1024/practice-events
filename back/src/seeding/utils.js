class Random 
{
    static float (min, max) {
        if (min == undefined) {
            max = 32767
        }
        if (max == undefined) {
            max = min
            min = 0
        }
        return Math.random() * (max - min) + min
    }

    static integer (min, max) {
        return Math.floor(this.float(min, max))
    }

    static choice (items) {
        return items[this.integer(0, items.length)]
    }

    static array (minSize, maxSize, generatorFunc) {
        let size = this.integer(minSize, maxSize)
        return Array(size).fill(0).map(generatorFunc)
    }

    static probability (p) {
        return p > Math.random()
    }
}

export {
    Random
}
