import React, {useEffect, useMemo, useRef, useState} from 'react'

export const useThrottle = <T> (value: T, wait: number = 50) => {
    // 传入函数时useState会执行函数，所以当value为函数时应该用一个函数去返回该函数
    const [throttle, setThrottle] = useState<T>(() => value)
    // 初始化时useEffect要执行一遍所以赋值应该为当前时间
    const previous = useRef<number>(Date.now())
    useEffect(() => {
        let now = Date.now()
        if (now - previous.current >= wait) {
            previous.current = now
            setThrottle(() => value)
        }
    }, [value, wait])
    return throttle
}

export const useDebounce = <T> (value: T, delay: number = 500) => {
    const [debounce, setDebounce] = useState<T>(() => value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounce(() => value)
        }, delay)
        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])
    return debounce
}


export const useComputed = <T> (fn: () => T, deps: any[]) => {
    const [computed, setComputed] = useState<T>()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memo = useMemo(() => fn(), deps)
    useEffect(() => {
        // TODO computed
        setComputed(memo)
    }, [memo])
    return computed
}


export function stopPropagation (e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation()
}
