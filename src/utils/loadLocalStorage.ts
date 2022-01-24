import {load, saveAll} from '../assets/ts/arrayStroe'
import {FAVORITE_KEY, PLAY_KEY} from '../assets/ts/constant'
import {processSongs} from '../services/song'
import {useAppDispatch} from '../store/hooks'
import {setFavoriteList, setPlayHistory} from '../store/reducers'

/**
 * 自定义hooks
 * 用于进入app时加载缓存的数据
 */
const useLoadLocalStorage = () => {
    const dispatch = useAppDispatch()
    const favoriteSong = load(FAVORITE_KEY)
    if (favoriteSong.length > 0) {
        processSongs(favoriteSong).then((songs) => {
            dispatch(setFavoriteList(songs))
            saveAll(songs, FAVORITE_KEY)
        })
    }
    const historySongs = load(PLAY_KEY)
    if (historySongs.length > 0) {
        processSongs(historySongs).then(songs => {
            dispatch(setPlayHistory(songs))
            saveAll(songs, PLAY_KEY)
        })
    }
}

export default useLoadLocalStorage
