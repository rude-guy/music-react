import {useAppDispatch, useAppSelector} from '../../store/hooks'
import {selectMusic, setSearchHistory} from '../../store/reducers'
import {clear, remove, save} from '../../assets/ts/arrayStroe'
import {SEARCH_KEY} from '../../assets/ts/constant'

/**
 * 自定义hooks
 * 搜索历史记录增删改
 */
export const useSearchHistory = () => {
    const dispatch = useAppDispatch()
    const {searchHistory} = useAppSelector(selectMusic)
    /**
     * 保存搜索历史
     * @param query
     */
    const saveSearchKey = (query: string) => {
        const searches = save(query, SEARCH_KEY, (item) => item === query)
        dispatch(setSearchHistory(searches))
    }

    /**
     * 删除搜索历史
     * @param query
     */
    const deleteSearchKey = (query: string) => {
        const searches = remove(SEARCH_KEY, (item) => item === query)
        dispatch(setSearchHistory(searches))
    }

    /**
     * 清空搜索历史
     */
    const clearSearch = () => {
        clear(SEARCH_KEY)
        dispatch(setSearchHistory([]))
    }
    return {searchHistory, saveSearchKey, deleteSearchKey, clearSearch}
}
