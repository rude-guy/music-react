export function shuffle<T extends any> (source: T[]) {
    const arr = source.slice()
    for (let i = 0; i < arr.length; i++) {
        const j = _getRandomInt(i)
        _swap(arr, i, j)
    }
    return arr
}

function _getRandomInt (max: number) {
    return Math.random() * (max + 1) | 0
}

function _swap<T extends any> (arr: T[], i: number, j: number) {
    const tem = arr[i]
    arr[i] = arr[j]
    arr[j] = tem
}


// 格式化时间
export function formatTime (interval: number) {
    interval = interval | 0
    const minute = ((interval / 60 | 0) + '').padStart(2, '0')
    const second = ((interval % 60 | 0) + '').padStart(2, '0')
    return `${minute}:${second}`
}
