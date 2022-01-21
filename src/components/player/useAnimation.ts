import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'


const useCreateAnimation = () => {
    const style = useRef<HTMLStyleElement>()
    const s = useRef<CSSStyleSheet>()

    const [animation, setAnimation] = useState<{
        [name: string]: string
    }>({})

    const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>()

    // 注册动画
    const registerAnimation = useCallback((name: string, animation: string) => {
        setAnimationStyle({
            animation: `${name} 0.6s cubic-bezier(0.45, 0, 0.55, 1)`
        })
        if (style.current == null) {
            style.current = document.createElement('style')
            document.getElementsByTagName('head')[0].appendChild(style.current)
            s.current = document.styleSheets[document.styleSheets.length - 1]
        }
        s.current?.insertRule(animation, s.current.cssRules.length)
        setAnimation({
            [name]: animation
        })
    }, [])

    // 注销动画
    const unregisterAnimation = useCallback((name) => {
        if (animation[name]) {
            setAnimation(animation => {
                delete animation[name]
                return animation
            })
            setAnimationStyle(undefined)
            // @ts-ignore
            const index = Array.from(s.current?.cssRules || []).findIndex(cssRule => cssRule.name === name)
            if (~index) {
                s.current?.deleteRule(index)
            }
        }
    }, [animation])

    // 删除style节点
    useEffect(() => {
        return () => {
            try {
                if (style.current instanceof HTMLStyleElement) {
                    document.getElementsByTagName('head')[0].removeChild(style.current)
                }
            } catch (e) {}
        }
    }, [])

    return {
        registerAnimation, unregisterAnimation, animationStyle
    }
}

const useAnimation = () => {
    const [entering, setEntering] = useState(false)
    const [leaving, setLeaving] = useState(false)

    const {animationStyle, registerAnimation, unregisterAnimation} = useCreateAnimation()


    const getPosAndScale = useMemo(() => {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        const scale = targetWidth / width
        return {x, y, scale}
    }, [])

    // 动画进入前
    function onEnter () {
        if (leaving) {
            onExited()
        }
        setEntering(true)
        const {x, y, scale} = getPosAndScale
        const animation = `
            @keyframes move {
                0% {
                    transform: translate3d(${x / 100}rem, ${y / 100}rem, 0) scale(${scale});
                }
            
                100% {
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }
        `
        registerAnimation('move', animation)
    }

    // 动画进入后
    function onEntered () {
        setEntering(false)
        unregisterAnimation('move')
    }

    // 动画退出前
    function onExit () {
        if (entering) {
            onEntered()
        }
        setLeaving(true)
        const {x, y, scale} = getPosAndScale
        const animation = `
            @keyframes leave {
                0% {
                   transform: translate3d(0, 0, 0) scale(1);
                }
            
                100% {
                    transform: translate3d(${x / 100}rem, ${y / 100}rem, 0) scale(${scale});
                }
            }
        `
        registerAnimation('leave', animation)
    }

    // 动画退出后
    function onExited () {
        setLeaving(false)
        unregisterAnimation('move')
    }

    return {
        onEnter, onEntered,
        onExit, onExited,
        animationStyle
    }
}

export default useAnimation
