// Node Modules
import React, { useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { useDroppable, UseDroppableOptions } from "../hooks/useDroppable";

let _nextDroppableId = 1;
export const _getUniqueDroppableId = (): number => {
  return _nextDroppableId++;
};

export { UseDroppableOptions };

interface DroppableProps<TData = unknown> extends UseDroppableOptions<TData> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
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
}: DroppableProps<TData>): React.ReactElement => {
  const viewRef = useRef<View>(null);

  const { viewProps } = useDroppable<TData>(
    {
      onDrop,
      dropDisabled,
      onActiveChange,
      dropAlignment,
      dropOffset,
      activeStyle,
    },
    viewRef
  );

  // The style is now fully handled in the hook and returned via viewProps.style
  return (
    <View ref={viewRef} {...viewProps} style={[style, viewProps.style]}>
      {children}
    </View>
  );
};
