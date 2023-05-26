import React from 'react';
import styles from './SearchList.module.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  searches: string[];

  showDelete?: boolean;

  deleteKey?: (query: string) => void;

  selectHistory(query: string): void;
}

const SearchList: React.FC<Props> = React.memo(({ searches, deleteKey, selectHistory, showDelete = true }) => {
  return (
    <div className={'search-list'}>
      <ul>
        <TransitionGroup component={null}>
          {searches.map((search) => (
            <CSSTransition timeout={300} classNames={'list'} key={search}>
              <li className={styles.searchItem} key={search} onClick={() => selectHistory(search)}>
                <span className={styles.text}>{search}</span>
                <span
                  className={'icon extend-click'}
                  style={{ display: showDelete ? '' : 'none' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteKey?.(search);
                  }}
                >
                  <i className={`${styles.iconDelete} icon-delete`} />
                </span>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    </div>
  );
});

export default SearchList;
