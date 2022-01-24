import storage from 'good-storage'

interface Compare<T> {
    (value: T, index: number, obj: T[]): unknown
}

/**
 * 浏览器缓存
 * @param item
 * @param key
 * @param compare
 * @param maxLen
 */
export function save<T> (item: T, key: string, compare: Compare<T>, maxLen: number = 100) {
    const items = storage.get(key, [])
    _inertArray(items, item, compare, maxLen)
    storage.set(key, items)
    return items
}

/**
 * 浏览器移除
 * @param key
 * @param compare
 */
export function remove<T> (key: string, compare: Compare<T>) {
    const items = storage.get(key, [])
    _deleteFromArray(items, compare)
    storage.set(key, items)
    return items
}

/**
 * 从缓存中读取初始化加载
 * @param key
 */
export function load (key: string) {
    return storage.get(key, [])
}

/**
 * 清空所有缓存
 * @param key
 */
export function clear (key: string) {
    storage.remove(key)
    return []
}

/**
 * 辅助函数, 重载Array.inertArray
 * @param arr
 * @param val
 * @param compare
 * @param maxLen
 */
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

/**
 * 保存所有数据
 * @param items
 * @param key
 */
export function saveAll<T> (items: T[], key: string) {
    storage.set(key, items)
}

/**
 * 辅助函数,从数组中删除元素
 * @param arr
 * @param compare
 */
function _deleteFromArray<T> (arr: T[], compare: Compare<T>) {
    const index = arr.findIndex(compare)
    if (~index) arr.splice(index, 1)
}
