// Node Modules
import React, { useRef, ReactNode } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useDroppable, UseDroppableOptions } from "../hooks/useDroppable";

let _nextDroppableId = 1;
export const _getUniqueDroppableId = (): number => {
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
  dropAlignment,
  dropOffset,
  style,
  children,
}: DroppableProps<TData>): React.ReactElement => {
  const viewRef = useRef<View>(null);

  const { viewProps /*, isActive */ } = useDroppable<TData>(
    {
      onDrop,
      dropDisabled,
      onActiveChange,
      dropAlignment,
      dropOffset,
    },
    viewRef
  );

  return (
    <View ref={viewRef} {...viewProps} style={style}>
      {children}
    </View>
  );
};
