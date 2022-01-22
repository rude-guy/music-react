import React, {ForwardedRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import BScroll from 'better-scroll'
export type Pos = {
    x: number
    y: number
}

type Props = {
    click: boolean
    probeType: number
    ref: ForwardedRef<any>
    onScroll?: (pos: Pos) => void
}

type ScrollProps = Partial<Props> & Omit<React.BlockquoteHTMLAttributes<HTMLElement>, 'onScroll'>


const Scroll: React.FC<ScrollProps> = React.forwardRef((props, ref) => {
    const {children, onScroll, click, probeType, ...options} = props
    const rootRef = useRef<HTMLDivElement>(null)

    const [bScroll, setBScroll] = useState<any>(null)

    useEffect(() => {
        let scrollVal: any = null
        if (rootRef.current !== null) {
            scrollVal = new BScroll(rootRef.current, {
                scrollX: false,
                scrollY: true,
                click,
                probeType
            })
            setBScroll(scrollVal)
        }
        return () => {
            setBScroll(null)
            scrollVal.destroy()
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!bScroll || !onScroll) return
        bScroll.on('scroll', onScroll)
        return () => {
            bScroll.off('scroll', onScroll)
        }
    }, [onScroll, bScroll])

    useImperativeHandle(ref, () => ({
        refresh() {
            if(bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        getBScroll() {
            if(bScroll) {
                return bScroll;
            }
        },
        scrollToElement (node: HTMLElement, time = 1000) {
            if (bScroll) {
                bScroll.scrollToElement(node, time)
            }
        },
        getChildren () {
            if (rootRef.current) {
                return rootRef.current.children
            }
        }
    }))

    return <div ref={rootRef} {...options}>
        {children}
    </div>
})


Scroll.defaultProps = {
    click: true,
    probeType: 0
}

export default Scroll
