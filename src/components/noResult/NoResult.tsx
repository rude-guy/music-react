import React from 'react';
import styles from './NoResult.module.css';

const NoResult = React.memo(({ title = '抱歉，没有结果' }: { title?: string }) => {
  return (
    <div className={styles.noResult}>
      <div className={styles.noResultContent}>
        <div className={styles.icon} />
        <p className={styles.text}>{title}</p>
      </div>
    </div>
  );
});

export default NoResult;
