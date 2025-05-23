import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SortableItemProps } from "./sortableTypes";
import { useSortable, UseSortableOptions } from "../hooks/useSortable";

export function SortableItem<T>({
  id,
  data,
  positions,
  lowerBound,
  autoScrollDirection,
  itemsCount,
  itemHeight,
  containerHeight,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
}: SortableItemProps<T>) {
  // Use our custom hook for all the sortable logic
  const sortableOptions: UseSortableOptions<T> = {
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
    containerHeight,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
  };

  const { animatedStyle, panGestureHandler, isMoving } =
    useSortable<T>(sortableOptions);

  // Combine the default animated style with any custom styles
  const combinedAnimatedStyle = [animatedStyle, customAnimatedStyle];

  return (
    <Animated.View style={combinedAnimatedStyle}>
      <PanGestureHandler
        onGestureEvent={panGestureHandler}
        activateAfterLongPress={200}
        shouldCancelWhenOutside={false}
      >
        <Animated.View style={style}>{children}</Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}
