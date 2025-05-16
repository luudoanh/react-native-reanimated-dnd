// Node Modules
import React, { useRef } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  useDraggable,
  UseDraggableOptions,
  AnimationFunction,
  CollisionAlgorithm,
} from "../hooks/useDraggable"; // Adjust path as needed

// Re-export UseDraggableOptions if it's meant to be part of the public API of Draggable component
export { UseDraggableOptions, AnimationFunction, CollisionAlgorithm };

interface DraggableProps<TData = unknown> extends UseDraggableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const Draggable = <TData = unknown,>({
  // Destructure component-specific props first
  style: componentStyle,
  children,
  // Collect all other props (which are now the modified UseDraggableOptions)
  ...useDraggableHookOptions
}: DraggableProps<TData>) => {
  const animatedViewRef = useRef<Animated.View>(null);

  // Pass the collected useDraggableHookOptions object directly to the hook
  const { animatedViewProps, gesture } = useDraggable<TData>(
    useDraggableHookOptions, // Pass through all options, including collisionAlgorithm
    animatedViewRef
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        ref={animatedViewRef}
        {...animatedViewProps}
        style={[componentStyle, animatedViewProps.style]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
