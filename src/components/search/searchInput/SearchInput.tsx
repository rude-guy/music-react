import React, {ForwardedRef, useImperativeHandle, useRef} from 'react'
import styles from './SearchInput.module.css'

interface Props {
    value?: string
    placeholder?: string
    onChange?: (e: React.FormEvent) => void
    onClose?: (e: React.MouseEvent) => void
    ref?: ForwardedRef<any>
}

const SearchInput: React.FC<Props> = React.forwardRef(({onChange, onClose, value, placeholder}, ref) => {
    const inputRef = useRef(null)

    useImperativeHandle(ref, () => ({
        getInputRef () {
            if (inputRef.current) {
                return inputRef.current
            }
        }
    }))

    return <div className={styles.searchInput}>
        <i className={`${styles.iconSearch} icon-search`}/>
        <input ref={inputRef}
               onChange={onChange}
               type="text"
               className={styles.inputInner}
               placeholder={placeholder}
               value={value}
        />
        <i className={`${styles.iconDismiss} icon-dismiss`}
           style={{display: value ? '' : 'none'}}
           onClick={onClose}
        />
    </div>
})


SearchInput.defaultProps = {
    value: '',
    placeholder: '搜索歌曲、歌手'
}

export default SearchInput
