import React, { useRef, useEffect, useContext, useCallback } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { SlotsContext, SlotsContextValue } from "../context/DropContext"; // Updated path
import { _getUniqueDroppableId } from "../components/Droppable"; // Path for ID generator remains

export interface UseDroppableOptions<TData = unknown> {
  onDrop: (data: TData) => void;
  dropDisabled?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

export interface UseDroppableReturn {
  viewProps: {
    onLayout: (event: LayoutChangeEvent) => void;
  };
  isActive: boolean;
}

export const useDroppable = <TData = unknown>(
  options: UseDroppableOptions<TData>,
  viewRef: React.RefObject<View> // Ref to the View acting as droppable
): UseDroppableReturn => {
  const { onDrop, dropDisabled, onActiveChange } = options;
  const id = useRef(_getUniqueDroppableId()).current; // Get unique ID

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
            // Pass id along with slot data for registration
            register(id, { x: pageX, y: pageY, width, height, onDrop });
          }
        );
      }
    },
    [id, onDrop, register, viewRef]
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
