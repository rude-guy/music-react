import storage from 'good-storage'

interface Compare<T> {
    (value: T, index: number, obj: T[]): unknown
}

export function save<T> (item: T, key: string, compare: Compare<T>, maxLen: number = 100) {
    const items = storage.get(key, [])
    _inertArray(items, item, compare, maxLen)
    storage.set(key, items)
    return items
}

export function remove<T> (key: string, compare: Compare<T>) {
    const items = storage.get(key, [])
    _deleteFromArray(items, compare)
    storage.set(key, items)
    return items
}

export function load (key: string) {
    return storage.get(key, [])
}

export function clear (key: string) {
    storage.remove(key)
    return []
}

function _inertArray<T> (arr: T[], val: T, compare: Compare<T>, maxLen: number) {
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) arr.pop()
}

export function saveAll<T> (items: T[], key: string) {
    storage.set(key, items)
}

function _deleteFromArray<T> (arr: T[], compare: Compare<T>) {
    const index = arr.findIndex(compare)
    if (~index) arr.splice(index, 1)
}
