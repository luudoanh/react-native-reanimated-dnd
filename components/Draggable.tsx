// Node Modules
import React, { useRef } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  useDraggable,
  UseDraggableOptions,
  UseDraggableReturn,
  AnimationFunction,
} from "../hooks/useDraggable"; // Adjust path as needed

// Re-export UseDraggableOptions if it's meant to be part of the public API of Draggable component
export { UseDraggableOptions, AnimationFunction };

interface DraggableProps<TData = unknown> extends UseDraggableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const Draggable = <TData = unknown,>({
  // Destructure options for the hook
  data,
  dragDisabled,
  onDragStart,
  onDragEnd,
  animationFunction,
  // Component-specific props
  style: componentStyle, // Rename to avoid conflict with hook's returned style
  children,
}: DraggableProps<TData>) => {
  const animatedViewRef = useRef<Animated.View>(null);

  const { animatedViewProps, gesture }: UseDraggableReturn =
    useDraggable<TData>(
      { data, dragDisabled, onDragStart, onDragEnd, animationFunction }, // Pass hook options
      animatedViewRef
    );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={animatedViewRef}
        {...animatedViewProps} // Spread the animated view props
        style={[componentStyle, animatedViewProps.style]} // Combine static and animated styles
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
