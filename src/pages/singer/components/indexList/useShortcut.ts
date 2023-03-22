import React, { useCallback } from 'react';
import { ScrollTo } from './useFixed';
import { useDebounce } from '../../../../utils/public';
interface Touch {
  anchorIndex: number;
  y1: number;
  y2: number;
}

export interface ShortcutEvent extends Omit<React.TouchEvent, 'target'> {
  target: EventTarget & {
    dataset?: { index: string | undefined };
  };
}
const ANCHOR_HEIGHT = 18;
const touch: Touch = {
  anchorIndex: 0,
  y1: 0,
  y2: 0
};

const useShortcut = (scrollTo: ScrollTo) => {
  const debounce = useDebounce(scrollTo, 100);
  // Shortcut
  const onShortcutTouchStart = useCallback(
    (e: ShortcutEvent) => {
      touch.y1 = e.touches[0].pageY;
      touch.anchorIndex = parseInt(e.target.dataset?.index as string);
      debounce(touch.anchorIndex);
    },
    [debounce]
  );

  const onShortcutTouchMove = useCallback(
    (e: ShortcutEvent) => {
      touch.y2 = e.touches[0].pageY;
      const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
      const anchorIndex = touch.anchorIndex + delta;
      scrollTo(anchorIndex, true);
    },
    [scrollTo]
  );

  return [onShortcutTouchStart, onShortcutTouchMove];
};

export default useShortcut;
