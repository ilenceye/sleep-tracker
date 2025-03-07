import { useGesture } from "@use-gesture/react";

export const useSwipe = (handlers?: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) => {
  const bind = useGesture({
    onDragEnd: ({ movement: [mx] }) => {
      if (mx > 50) {
        handlers?.onSwipeLeft?.();
        return;
      }

      if (mx < -50) {
        handlers?.onSwipeRight?.();
        return;
      }
    },
  });

  return bind;
};
