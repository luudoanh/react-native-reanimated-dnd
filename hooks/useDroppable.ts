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

  const {
    register,
    unregister,
    isRegistered,
    activeHoverSlotId: contextActiveHoverSlotId,
  } = useContext(SlotsContext) as SlotsContextValue<TData>;

  const isActive = contextActiveHoverSlotId === id;

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  const handleLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      if (viewRef.current) {
        viewRef.current.measure(
          (_frameX, _frameY, width, height, pageX, pageY) => {
            register(id, {
              x: pageX,
              y: pageY,
              width,
              height,
              onDrop,
              dropAlignment: dropAlignment || "center",
              dropOffset: dropOffset || { x: 0, y: 0 },
            });
          }
        );
      }
    },
    [id, onDrop, register, viewRef, dropAlignment, dropOffset]
  );

  useEffect(() => {
    if (dropDisabled) {
      unregister(id);
    } else {
      if (!isRegistered(id)) {
        handleLayoutHandler(undefined as any);
      }
    }
  }, [dropDisabled, id, register, unregister, isRegistered]);

  useEffect(() => {
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
