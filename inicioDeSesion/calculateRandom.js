const calculate = (qty) => {
    let result = {}

    for(let i = 0; i < qty; i++) {
        const random = Math.floor(Math.random()*1000)
        if(result[random]){
            result[random]++
        }
        else {
            result[random] = 1
        }
    }
    return result
}

process.on('message', qty => {
    const result = calculate(qty)
    process.send(result)
})