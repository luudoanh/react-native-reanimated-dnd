import React, {
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedRef,
  measure,
  runOnUI,
  runOnJS,
} from "react-native-reanimated";
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
  activeStyle?: StyleProp<ViewStyle>;
  droppableId?: string;
  capacity?: number;
}

export interface UseDroppableReturn {
  viewProps: {
    onLayout: (event: LayoutChangeEvent) => void;
    style?: StyleProp<ViewStyle>; // Style to apply when active
  };
  isActive: boolean;
  activeStyle?: StyleProp<ViewStyle>;
  animatedViewRef: ReturnType<typeof useAnimatedRef<Animated.View>>;
}

export const useDroppable = <TData = unknown>(
  options: UseDroppableOptions<TData>
): UseDroppableReturn => {
  const {
    onDrop,
    dropDisabled,
    onActiveChange,
    dropAlignment,
    dropOffset,
    activeStyle,
    droppableId,
    capacity,
  } = options;

  // Create animated ref first
  const animatedViewRef = useAnimatedRef<Animated.View>();

  const id = useRef(_getUniqueDroppableId()).current;
  const stringId = useRef(droppableId || `droppable-${id}`).current;
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

  // Process active style to separate transforms from other styles
  const { processedActiveStyle, activeTransforms } = useMemo(() => {
    if (!isActive || !activeStyle) {
      return { processedActiveStyle: null, activeTransforms: [] };
    }

    const flattenedStyle = StyleSheet.flatten(activeStyle);
    let processedStyle = { ...flattenedStyle };
    let transforms: any[] = [];

    // Extract and process transforms if present
    if (flattenedStyle.transform) {
      if (Array.isArray(flattenedStyle.transform)) {
        transforms = [...flattenedStyle.transform];
      }

      // Remove transform from the main style to avoid conflicts
      delete processedStyle.transform;
    }

    return {
      processedActiveStyle: processedStyle,
      activeTransforms: transforms,
    };
  }, [isActive, activeStyle]);

  // Create the final style with transforms properly handled
  const combinedActiveStyle = useMemo(() => {
    if (!isActive || !activeStyle) {
      return undefined;
    }

    // If there are no transforms, just return the processed style
    if (activeTransforms.length === 0) {
      return processedActiveStyle;
    }

    // Add transforms to the style
    return {
      ...processedActiveStyle,
      transform: activeTransforms,
    };
  }, [isActive, activeStyle, processedActiveStyle, activeTransforms]);

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  useEffect(() => {
    console.log(
      `Droppable ${id} using string ID: ${stringId}, provided ID: ${
        droppableId || "none"
      }`
    );
  }, [id, stringId, droppableId]);

  const updateDroppablePosition = useCallback(() => {
    runOnUI(() => {
      "worklet";
      const measurement = measure(animatedViewRef);
      if (measurement === null) {
        return;
      }

      if (measurement.width > 0 && measurement.height > 0) {
        // Ensure valid dimensions before registering
        runOnJS(register)(id, {
          id: droppableId || `droppable-${id}`,
          x: measurement.pageX,
          y: measurement.pageY,
          width: measurement.width,
          height: measurement.height,
          onDrop,
          dropAlignment: dropAlignment || "center",
          dropOffset: dropOffset || { x: 0, y: 0 },
          capacity,
        });
      }
    })();
  }, [
    id,
    droppableId,
    onDrop,
    register,
    animatedViewRef,
    dropAlignment,
    dropOffset,
    capacity,
  ]);

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
      style: combinedActiveStyle,
    },
    isActive,
    activeStyle,
    animatedViewRef,
  };
};
