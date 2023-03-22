import { useRef } from 'react';
/**
 * 自定hooks
 */
const useConfirm = () => {
  /**
   * 显示Confirm对话框
   */
  const confirmRef = useRef<any>(null);
  function openConfirm() {
    confirmRef.current?.show();
  }

  return {
    confirmRef,
    openConfirm
  };
};

export default useConfirm;
