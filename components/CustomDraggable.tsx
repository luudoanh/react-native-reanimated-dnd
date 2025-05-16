import React, { useRef, createContext, useContext } from "react";
import { ViewStyle, StyleProp } from "react-native";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  useDraggable,
  UseDraggableOptions,
  DraggableState,
} from "../hooks/useDraggable";

export interface CustomDraggableProps<TData = unknown>
  extends UseDraggableOptions<TData> {
  initialStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

// Create a context for CustomDraggable
interface CustomDraggableContextValue {
  gesture: any;
}

const CustomDraggableContext =
  createContext<CustomDraggableContextValue | null>(null);

// Handle component for CustomDraggable
interface HandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Handle = ({ children, style }: HandleProps) => {
  const draggableContext = useContext(CustomDraggableContext);

  if (!draggableContext) {
    console.warn(
      "CustomDraggable.Handle must be used within a CustomDraggable component"
    );
    return <>{children}</>;
  }

  return (
    <GestureDetector gesture={draggableContext.gesture}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  );
};

const CustomDraggableComponent = <TData = unknown,>({
  children,
  initialStyle,
  ...draggableOptions
}: CustomDraggableProps<TData>) => {
  const animatedViewRef = useRef<Animated.View>(null);
  const { animatedViewProps, gesture, hasHandle } = useDraggable<TData>(
    {
      ...draggableOptions,
      children,
      handleComponent: Handle,
    },
    animatedViewRef
  );

  const combinedStyle = [initialStyle, animatedViewProps.style];

  // Create context value
  const contextValue: CustomDraggableContextValue = {
    gesture,
  };

  // Render with context
  const content = (
    <Animated.View
      ref={animatedViewRef}
      {...animatedViewProps}
      style={combinedStyle}
    >
      <CustomDraggableContext.Provider value={contextValue}>
        {children}
      </CustomDraggableContext.Provider>
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

// Attach Handle as a static property
export const CustomDraggable = Object.assign(CustomDraggableComponent, {
  Handle,
});
