import React, { ForwardedRef, useImperativeHandle, useRef, useState } from 'react';
import styles from './Message.module.css';
import { CSSTransition } from 'react-transition-group';

interface Props {
  delay?: number;
  ref: ForwardedRef<any>;
}

const Message: React.FC<Props> = React.memo(
  React.forwardRef(({ children, delay = 2000 }, ref) => {
    const [visible, setVisible] = useState(false);
    let timer = useRef<NodeJS.Timeout | null>(null);

    /**
     * 显示弹窗
     */
    function show() {
      setVisible(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      // 显示时间
      timer.current = setTimeout(hide, delay);
    }

    /**
     * 隐藏弹窗
     */
    function hide() {
      setVisible(false);
    }

    /**
     * 转发ref
     */
    useImperativeHandle(ref, () => ({
      show,
      hide
    }));

    return (
      <CSSTransition classNames={'slide-down'} timeout={300} in={visible} unmountOnExit>
        <div className={styles.message}>{children}</div>
      </CSSTransition>
    );
  })
);

export default Message;
