import React, { useRef, useEffect, useContext, useCallback } from "react";
import { View, LayoutChangeEvent } from "react-native";
import { SlotsContext, SlotsContextValue } from "../context/DropContext"; // Updated path
import { _getUniqueDroppableId } from "../components/Droppable"; // Path for ID generator remains

export interface UseDroppableOptions<TData = unknown> {
  onDrop: (data: TData) => void;
  dropDisabled?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

export const useDroppable = <TData = unknown>(
  options: UseDroppableOptions<TData>,
  viewRef: React.RefObject<View> // Ref to the View acting as droppable
) => {
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

  const handleLayoutHandler = useCallback(() => {
    if (viewRef.current) {
      viewRef.current.measure(
        (_frameX, _frameY, width, height, pageX, pageY) => {
          // Pass id along with slot data for registration
          register(id, { x: pageX, y: pageY, width, height, onDrop });
        }
      );
    }
  }, [id, onDrop, register, viewRef]);

  useEffect(() => {
    if (dropDisabled) {
      unregister(id);
    } else {
      if (!isRegistered(id)) {
        handleLayoutHandler(); // Call the memoized handler
      }
    }
    // Re-register if onDrop changes and not disabled
    // The handleLayoutHandler dependency on `onDrop` ensures it runs if onDrop changes,
    // and the View's onLayout will pick it up.
    // If it was disabled and then enabled with a new onDrop, this effect also ensures registration.
  }, [
    dropDisabled,
    id,
    register,
    unregister,
    isRegistered,
    handleLayoutHandler, // Use memoized handler
    // onDrop is a dependency of handleLayoutHandler
  ]);

  useEffect(() => {
    return () => {
      unregister(id);
    };
  }, [id, unregister]);

  return { onLayoutHandler: handleLayoutHandler };
};
