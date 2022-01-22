import React, {ForwardedRef, useImperativeHandle, useState} from 'react'
import styles from './Confirm.module.css'
import './Confirm.css'
import {CSSTransition} from 'react-transition-group'

export interface ConfirmProps {
    text: string
    confirmBtnText: string
    cancelBtnText: string
    confirm(): void
    cancel(): void
    ref: ForwardedRef<any>
}

const Confirm: React.FC<Partial<ConfirmProps>> = React.memo(React.forwardRef((props, ref) => {
    const {text, confirmBtnText, cancelBtnText, confirm, cancel} = props
    const [visible, setVisible] = useState(false)

    function onConfirm (e: React.MouseEvent) {
        confirm?.()
        hide()
        e.stopPropagation()
    }

    function onCancel (e: React.MouseEvent) {
        console.log(1)
        cancel?.()
        hide()
        e.stopPropagation()
    }

    function show () {
        setVisible(true)
    }

    function hide () {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({show, hide}))

    return (
        <CSSTransition classNames={'confirm-fade'} in={visible} timeout={300} unmountOnExit>
            <div className={styles.confirm}>
                <div className={styles.confirmWrapper}>
                    <div className={`${styles.confirmContent} confirm-content`}>
                        <p className={styles.text}>{text}</p>
                        <div className={styles.operate}>
                            <div className={`${styles.operateBtn} ${styles.left}`}
                                 onClick={(e) => onConfirm(e)}
                            >{confirmBtnText}</div>
                            <div className={styles.operateBtn}
                                 onClick={(e) => onCancel(e)}
                            >{cancelBtnText}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}))

Confirm.defaultProps = {
    text: '',
    confirmBtnText: '确定',
    cancelBtnText: '取消'
}

export default Confirm

