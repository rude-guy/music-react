import {useState} from 'react'
import {useAppSelector} from '../../store/hooks'
import {selectMusic} from '../../store/reducers'

const useAnimation = () => {
    const {fullScreen} = useAppSelector(selectMusic)
}

export default useAnimation
