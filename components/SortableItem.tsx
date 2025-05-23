import React, { createContext, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { SortableItemProps } from "./sortableTypes";
import { useSortable, UseSortableOptions } from "../hooks/useSortable";

// Create a context to share gesture between SortableItem and SortableHandle
interface SortableContextValue {
  panGestureHandler: any;
}

const SortableContext = createContext<SortableContextValue | null>(null);

// SortableHandle subcomponent
interface SortableHandleProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SortableHandle = ({ children, style }: SortableHandleProps) => {
  const sortableContext = useContext(SortableContext);

  if (!sortableContext) {
    console.warn("SortableHandle must be used within a SortableItem component");
    return <>{children}</>;
  }

  return (
    <PanGestureHandler onGestureEvent={sortableContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

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
    children,
    handleComponent: SortableHandle,
  };

  const { animatedStyle, panGestureHandler, isMoving, hasHandle } =
    useSortable<T>(sortableOptions);

  // Combine the default animated style with any custom styles
  const combinedAnimatedStyle = [animatedStyle, customAnimatedStyle];

  // Create the context value
  const contextValue: SortableContextValue = {
    panGestureHandler,
  };

  const content = (
    <Animated.View style={combinedAnimatedStyle}>
      <SortableContext.Provider value={contextValue}>
        <Animated.View style={style}>{children}</Animated.View>
      </SortableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable with PanGestureHandler
  if (hasHandle) {
    return content;
  } else {
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
}

// Attach the SortableHandle as a static property
SortableItem.Handle = SortableHandle;
