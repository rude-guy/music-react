import { useEffect, useRef, useState } from 'react';
import BScroll from 'better-scroll';

/**
 * 自定义hooks
 * 注册BScroll使其能上拉刷新
 * @param requestData: () => Promise<void> 接口数据
 * @param pullUpLoading: 阻止下拉刷新
 * return {
 *     scroll: BScroll实例
 *     rootRef: 根元素DOM
 *     isPullUpload: 是否可以上拉刷新
 * }
 */
const usePullLoad = (requestData: () => Promise<void>, pullUpLoading: boolean) => {
  const scroll = useRef<any>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPullUpload, setIsPullUpload] = useState(false);

  useEffect(() => {
    let timer: any;
    timer = setTimeout(() => {
      setIsPullUpload(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [isPullUpload]);

  /**
   * 注册BScroll
   */
  useEffect(() => {
    if (rootRef.current == null) return;
    const scrollVal = (scroll.current = new BScroll(rootRef.current, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    }));
    scrollVal.on('pullingUp', pullingUpHandler);
    /**
     * 下拉刷新回调
     */
    async function pullingUpHandler() {
      if (pullUpLoading) {
        scrollVal.finishPullUp();
        return;
      }
      setIsPullUpload(true);
      await requestData();
      scrollVal.finishPullUp();
      scrollVal.refresh();
    }
    return () => {
      scrollVal.destroy();
    };
  }, [pullUpLoading]);

  return {
    scroll,
    rootRef,
    isPullUpload
  };
};

export default usePullLoad;
