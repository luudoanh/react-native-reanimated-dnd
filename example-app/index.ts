import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Export vertical sortable components
export { Sortable } from "./components/Sortable";
export { SortableItem } from "./components/SortableItem";
export { SortableExample } from "./components/SortableExample";

// Export horizontal sortable components
export { HorizontalSortable } from "./components/HorizontalSortable";
export { HorizontalSortableItem } from "./components/HorizontalSortableItem";
export { HorizontalSortableExample } from "./components/HorizontalSortableExample";

// Export hooks
export { useSortableList } from "./hooks/useSortableList";
export { useSortable } from "./hooks/useSortable";
export { useHorizontalSortableList } from "./hooks/useHorizontalSortableList";
export { useHorizontalSortable } from "./hooks/useHorizontalSortable";

// Export utilities
export * from "./components/sortableUtils";

// Export types
export type {
  SortableProps,
  SortableItemProps,
  SortableRenderItemProps,
  SortableHandleProps,
  UseSortableOptions,
  UseSortableReturn,
  UseSortableListOptions,
  UseSortableListReturn,

  // Horizontal types
  HorizontalSortableProps,
  HorizontalSortableItemProps,
  HorizontalSortableRenderItemProps,
  UseHorizontalSortableOptions,
  UseHorizontalSortableReturn,
  UseHorizontalSortableListOptions,
  UseHorizontalSortableListReturn,

  // Enums
  ScrollDirection,
  HorizontalScrollDirection,
} from "./types/sortable";
