import React, { useRef, useEffect, useContext, useCallback } from "react";
import { View, LayoutChangeEvent } from "react-native";
import {
  SlotsContext,
  SlotsContextValue,
  DropAlignment,
  DropOffset,
} from "../context/DropContext";
import { _getUniqueDroppableId } from "../components/Droppable";

export interface UseDroppableOptions<TData = unknown> {
  onDrop: (data: TData) => void;
  dropDisabled?: boolean;
  onActiveChange?: (isActive: boolean) => void;
  dropAlignment?: DropAlignment;
  dropOffset?: DropOffset;
}

export interface UseDroppableReturn {
  viewProps: {
    onLayout: (event: LayoutChangeEvent) => void;
  };
  isActive: boolean;
}

export const useDroppable = <TData = unknown>(
  options: UseDroppableOptions<TData>,
  viewRef: React.RefObject<View>
): UseDroppableReturn => {
  const { onDrop, dropDisabled, onActiveChange, dropAlignment, dropOffset } =
    options;
  const id = useRef(_getUniqueDroppableId()).current;
  const instanceId = useRef(
    `droppable-${id}-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  const {
    register,
    unregister,
    isRegistered,
    activeHoverSlotId: contextActiveHoverSlotId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
  } = useContext(SlotsContext) as SlotsContextValue<TData>;

  const isActive = contextActiveHoverSlotId === id;

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  const updateDroppablePosition = useCallback(() => {
    if (!viewRef.current) return;

    viewRef.current.measure((_frameX, _frameY, width, height, pageX, pageY) => {
      if (width > 0 && height > 0) {
        // Ensure valid dimensions before registering
        register(id, {
          x: pageX,
          y: pageY,
          width,
          height,
          onDrop,
          dropAlignment: dropAlignment || "center",
          dropOffset: dropOffset || { x: 0, y: 0 },
        });
      } else {
        // Optionally, unregister or handle invalid measurement if needed
        // console.warn(`Droppable ${id} measured with zero dimensions.`);
      }
    });
  }, [id, onDrop, register, viewRef, dropAlignment, dropOffset]);

  const handleLayoutHandler = useCallback(
    (_event: LayoutChangeEvent) => {
      updateDroppablePosition();
    },
    [updateDroppablePosition]
  );

  useEffect(() => {
    registerPositionUpdateListener(instanceId, updateDroppablePosition);
    return () => {
      unregisterPositionUpdateListener(instanceId);
    };
  }, [
    instanceId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
    updateDroppablePosition,
  ]);

  useEffect(() => {
    if (dropDisabled) {
      unregister(id);
    } else {
      // Initial registration or re-registration if it became enabled
      updateDroppablePosition();
    }
    // Not relying on isRegistered here for initial registration to ensure it always attempts
    // to register if not disabled. The measure call inside updateDroppablePosition is the gatekeeper.
  }, [
    dropDisabled,
    id,
    unregister, // only unregister is truly a dependency for the disabled case
    updateDroppablePosition, // for the enabled case
  ]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      unregister(id);
    };
  }, [id, unregister]);

  return {
    viewProps: {
      onLayout: handleLayoutHandler,
    },
    isActive,
  };
};
