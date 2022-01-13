import React, {useEffect, useState} from 'react'
import {Carousel, List} from 'antd'
import styles from './Recommend.module.css'
import './Recommend.css'
import {getRecommend} from '../../services/recommend'

export interface Slider {
    id: string
    link: string
    pic: string
}

export interface Album {
    id: number
    pic: string
    title: string
    username: string
}

export interface ResRecommend {
    sliders: Slider[]
    albums: Album[]
}

const Recommend = () => {
    const [albums, setAlbums] = useState([] as Album[])
    const [sliders, setSliders] = useState([] as Slider[])
    useEffect(() => {
        const getData = async () => {
            const {albums, sliders} = await getRecommend()
            setAlbums(albums)
            setSliders(sliders)
        }
        getData()
    }, [])
    return (
        <div className={'recommend'}>
            <div className={'carousel-wrap'}>
                <Carousel autoplay
                          dots={{className: styles.dot}}
                          style={{lineHeight: '0'}}
                >
                    {
                        sliders?.length ? sliders.map(slider => {
                            return <img className={styles.carouselItem}
                                        key={slider.id}
                                        src={slider.pic}
                                        alt={'banner'}
                            />
                        }) : <div className={styles.space}/>
                    }
                </Carousel>
            </div>
            <div className={'recommend-list-wrap'}>
                <h1 className={styles.listTitle}>热门歌单推荐</h1>
                <List
                    itemLayout="horizontal"
                    dataSource={albums}
                    split={false}
                    renderItem={item => (
                        <List.Item className={styles.listItem}>
                            <List.Item.Meta
                                className={'recommend-list'}
                                avatar={
                                    <div className={styles.icon}>
                                        <img width="60" height="60"
                                             src={item.pic} alt={'歌单'}
                                        />
                                    </div>
                                }
                                title={item.username}
                                description={item.title}
                            />
                        </List.Item>
                    )}
                />,
            </div>
        </div>
    )
}

export default Recommend
