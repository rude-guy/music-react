import React from 'react'
import styles from './Switches.module.css'

interface Props {
    items: string[]
    modelIndex?: number

    /**
     * 切换项回调
     * @param index
     */
    switchItem (index: number): void
}

const Switches: React.FC<Props> = React.memo(({items, modelIndex = 0, switchItem}) => {
    return <ul className={styles.switches}>
        {
            items.map((item, index) => (
                <li className={`${styles.switchItem} ${modelIndex === index ? styles.active : ''}`}
                    key={item + index}
                    onClick={() => switchItem(index)}
                >
                    <span>{item}</span>
                </li>
            ))
        }
        <div className={styles.activeBar}
            // active样式
             style={{transform: `translate3d(${1.2 * modelIndex}rem, 0, 0)`}}
        />
    </ul>
})

export default Switches
