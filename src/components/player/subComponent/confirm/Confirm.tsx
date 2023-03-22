import React, { ForwardedRef, useImperativeHandle, useState } from 'react';
import styles from './Confirm.module.css';
import './Confirm.css';
import { CSSTransition } from 'react-transition-group';

/**
 * Confirm组件Props
 */
export interface ConfirmProps {
  text: string;
  confirmBtnText: string;
  cancelBtnText: string;
  confirm(): void;
  cancel(): void;
  ref: ForwardedRef<any>; // 转发的Ref
}

const Confirm: React.FC<Partial<ConfirmProps>> = React.memo(
  React.forwardRef((props, ref) => {
    const { text, confirmBtnText, cancelBtnText, confirm, cancel } = props;
    const [visible, setVisible] = useState(false);

    /**
     * 点击确定按钮
     * @param e
     */
    function onConfirm(e: React.MouseEvent) {
      confirm?.();
      hide();
      e.stopPropagation();
    }

    /**
     * 点击取消按钮
     * @param e
     */
    function onCancel(e: React.MouseEvent) {
      cancel?.();
      hide();
      e.stopPropagation();
    }

    /**
     * 显示
     */
    function show() {
      setVisible(true);
    }

    /**
     * 隐藏
     */
    function hide() {
      setVisible(false);
    }

    /**
     * 转发Ref
     */
    useImperativeHandle(ref, () => ({ show, hide }));

    return (
      <CSSTransition classNames={'confirm-fade'} in={visible} timeout={300} unmountOnExit>
        <div className={styles.confirm}>
          <div className={styles.confirmWrapper}>
            <div className={`${styles.confirmContent} confirm-content`}>
              <p className={styles.text}>{text}</p>
              <div className={styles.operate}>
                <div className={`${styles.operateBtn} ${styles.left}`} onClick={(e) => onConfirm(e)}>
                  {confirmBtnText}
                </div>
                <div className={styles.operateBtn} onClick={(e) => onCancel(e)}>
                  {cancelBtnText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  })
);

Confirm.defaultProps = {
  text: '',
  confirmBtnText: '确定',
  cancelBtnText: '取消'
};

export default Confirm;
