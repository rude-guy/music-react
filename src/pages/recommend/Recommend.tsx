import React, {useEffect, useState} from 'react'
import {Route, Switch, useHistory, useRouteMatch} from 'react-router-dom'
import {Carousel, List} from 'antd'
import styles from './Recommend.module.css'
import './Recommend.css'
import Album from './album/Album'
import {getRecommend} from '../../services/recommend'
import Loading from '../../components/loading/Loading'
import {useLoadScroll} from '../../utils/hooks'
import Scroll from '../../components/scroll/Scroll'
import storage from 'good-storage'
import {ALBUM_KEY} from '../../assets/ts/constant'

export interface Slider {
    id: string
    link: string
    pic: string
}

export interface AlbumParams {
    id: number
    pic: string
    title: string
    username: string
}

export interface ResRecommend {
    sliders: Slider[]
    albums: AlbumParams[]
}

const Recommend = () => {
    const [albums, setAlbums] = useState<AlbumParams[]>([])
    const [sliders, setSliders] = useState<Slider[]>([])
    const {scrollRef, playListStyle} = useLoadScroll(albums, 150)
    const {path, url} = useRouteMatch()
    const history = useHistory()

    useEffect(() => {
        getRecommend().then(res => {
            const {albums, sliders} = res
            setAlbums(albums)
            setSliders(sliders)
        })
        return () => {
        }
    }, [])

    /**
     * 选择推荐
     * @param item
     */
    const selectItem = (item: AlbumParams) => {
        storage.session.set(ALBUM_KEY, item)
        console.log(`${url}/${item.id}`)
        history.push(`${url}/${item.id}`)
    }

    return <>
        {
            albums.length && sliders.length ? <div className={styles.recommend}
                                                   style={playListStyle}
            >
                <Scroll className={styles.recommendContent}
                        ref={scrollRef}
                >
                    <div>
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
                                    <List.Item className={styles.listItem}
                                               onClick={() => selectItem(item)}
                                    >
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
                            />
                        </div>
                    </div>
                </Scroll>
            </div> : <Loading/>
        }
        <Switch>
            <Route path={`${path}/:albumId`} component={Album}/>
        </Switch>
    </>
}

export default Recommend
