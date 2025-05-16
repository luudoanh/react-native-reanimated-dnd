// Node Modules
import React, { useRef, createContext, useContext, useState } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  useDraggable,
  UseDraggableOptions,
  AnimationFunction,
  CollisionAlgorithm,
  DraggableState,
} from "../hooks/useDraggable"; // Adjust path as needed

// Re-export UseDraggableOptions if it's meant to be part of the public API of Draggable component
export {
  UseDraggableOptions,
  AnimationFunction,
  CollisionAlgorithm,
  DraggableState,
};

// Create a context to share gesture and state between Draggable and Handle
interface DraggableContextValue {
  gesture: any;
  state: DraggableState;
}

const DraggableContext = createContext<DraggableContextValue | null>(null);

interface DraggableProps<TData = unknown> extends UseDraggableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onStateChange?: (state: DraggableState) => void;
}

// Handle subcomponent
interface HandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Handle = ({ children, style }: HandleProps) => {
  const draggableContext = useContext(DraggableContext);

  if (!draggableContext) {
    console.warn("Draggable.Handle must be used within a Draggable component");
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={draggableContext.gesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

const DraggableComponent = <TData = unknown,>({
  // Destructure component-specific props first
  style: componentStyle,
  children,
  // Collect all other props (which are now the modified UseDraggableOptions)
  ...useDraggableHookOptions
}: DraggableProps<TData>) => {
  const animatedViewRef = useRef<Animated.View>(null);

  // Pass the collected useDraggableHookOptions object directly to the hook
  // Also pass children and Handle component reference for handle detection
  const { animatedViewProps, gesture, state, hasHandle } = useDraggable<TData>(
    {
      ...useDraggableHookOptions,
      children,
      handleComponent: Handle,
    },
    animatedViewRef
  );

  // Create the context value
  const contextValue: DraggableContextValue = {
    gesture,
    state,
  };

  // Render the component
  const content = (
    <Animated.View
      ref={animatedViewRef}
      {...animatedViewProps}
      style={[componentStyle, animatedViewProps.style]}
    >
      <DraggableContext.Provider value={contextValue}>
        {children}
      </DraggableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable
  if (hasHandle) {
    return content;
  } else {
    return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
  }
};

// Attach the Handle as a static property
export const Draggable = Object.assign(DraggableComponent, { Handle });
