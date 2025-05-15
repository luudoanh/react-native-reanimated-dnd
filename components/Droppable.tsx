// Node Modules
import React, { useRef, ReactNode, useContext } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import {
  useDroppable,
  UseDroppableOptions,
  UseDroppableReturn,
} from "../hooks/useDroppable";

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

  const { viewProps, isActive: _isActive } = useDroppable<TData>(
    { onDrop, dropDisabled, onActiveChange },
    viewRef
  );

  return (
    <View ref={viewRef} {...viewProps} style={style}>
      {children}
    </View>
  );
};
