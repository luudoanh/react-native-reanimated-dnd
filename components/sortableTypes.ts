import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { ScrollDirection } from "./sortableUtils";

// SortableItem Props Interface
export interface SortableItemProps<T> {
  id: string;
  data: T;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
  containerHeight?: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  animatedStyle?: StyleProp<ViewStyle>;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (id: string, position: number) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;
}

// Sortable Props Interface
export interface SortableProps<TData> {
  data: TData[];
  renderItem: (props: SortableRenderItemProps<TData>) => ReactNode;
  itemHeight: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemKeyExtractor?: (item: TData, index: number) => string;
}

// Props passed to renderItem function
export interface SortableRenderItemProps<TData> {
  item: TData;
  index: number;
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
}
