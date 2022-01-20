import {useMemo} from 'react'
import {useAppSelector} from '../store/hooks'
import {selectMusic} from '../store/reducers'

export const useScrollStyle = () => {
    const {playList} = useAppSelector(selectMusic)
    return useMemo(() => {
        return {
            bottom: playList.length ? '.6rem' : '0'
        }
    }, [playList])
}
