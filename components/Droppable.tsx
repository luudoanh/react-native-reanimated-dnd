// Node Modules
import React, { useRef, useContext, ReactNode } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useDroppable, UseDroppableOptions } from "../hooks/useDroppable";
import { SlotsContext, SlotsContextValue } from "../context/DropContext";

let _nextDroppableId = 1;
export const _getUniqueDroppableId = () => {
  return _nextDroppableId++;
};

export { UseDroppableOptions };

interface DroppableProps<TData = unknown> extends UseDroppableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export const Droppable = <TData = unknown,>({
  onDrop,
  dropDisabled,
  onActiveChange,
  style,
  children,
}: DroppableProps<TData>): React.ReactElement => {
  const viewRef = useRef<View>(null);

  const { onLayoutHandler } = useDroppable<TData>(
    { onDrop, dropDisabled, onActiveChange },
    viewRef
  );

  return (
    <View ref={viewRef} onLayout={onLayoutHandler} style={style}>
      {children}
    </View>
  );
};
