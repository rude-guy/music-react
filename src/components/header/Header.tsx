import { Link } from 'react-router-dom';
import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <span className={styles.icon} />
      <h1 className={styles.text}>Chicken Music</h1>
      <Link className={styles.mine} to="/user">
        <i className={`icon-mine ${styles.iconMine}`} />
      </Link>
    </div>
  );
};

export default Header;
