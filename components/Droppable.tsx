// Node Modules
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useDroppable, UseDroppableOptions } from "../hooks/useDroppable";

let _nextDroppableId = 1;
export const _getUniqueDroppableId = (): number => {
  return _nextDroppableId++;
};

export { UseDroppableOptions };

interface DroppableProps<TData = unknown> extends UseDroppableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  droppableId?: string;
  capacity?: number;
}

export const Droppable = <TData = unknown,>({
  onDrop,
  dropDisabled,
  onActiveChange,
  dropAlignment,
  dropOffset,
  activeStyle,
  style,
  children,
  droppableId,
  capacity,
}: DroppableProps<TData>): React.ReactElement => {
  const { viewProps, animatedViewRef } = useDroppable<TData>({
    onDrop,
    dropDisabled,
    onActiveChange,
    dropAlignment,
    dropOffset,
    activeStyle,
    droppableId,
    capacity,
  });

  // The style is now fully handled in the hook and returned via viewProps.style
  return (
    <Animated.View
      ref={animatedViewRef}
      {...viewProps}
      style={[style, viewProps.style]}
      collapsable={false}
    >
      {children}
    </Animated.View>
  );
};
