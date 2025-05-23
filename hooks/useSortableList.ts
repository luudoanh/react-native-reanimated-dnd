import { useRef, useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { ScrollDirection, listToObject } from "../components/sortableUtils";
import { DropProviderRef } from "../context/DropContext";

export interface UseSortableListOptions<TData> {
  data: TData[];
  itemHeight: number;
  itemKeyExtractor?: (item: TData, index: number) => string;
}

export interface UseSortableListReturn<TData> {
  positions: any;
  scrollY: any;
  autoScroll: any;
  scrollViewRef: any;
  dropProviderRef: React.RefObject<DropProviderRef>;
  handleScroll: any;
  handleScrollEnd: () => void;
  contentHeight: number;
  getItemProps: (
    item: TData,
    index: number
  ) => {
    id: string;
    positions: any;
    lowerBound: any;
    autoScrollDirection: any;
    itemsCount: number;
    itemHeight: number;
  };
}

export function useSortableList<TData extends { id: string }>(
  options: UseSortableListOptions<TData>
): UseSortableListReturn<TData> {
  const { data, itemHeight, itemKeyExtractor = (item) => item.id } = options;

  // Set up shared values
  const positions = useSharedValue(listToObject(data));
  const scrollY = useSharedValue(0);
  const autoScroll = useSharedValue(ScrollDirection.None);
  const scrollViewRef = useAnimatedRef();
  const dropProviderRef = useRef<DropProviderRef>(null);

  // Scrolling synchronization
  useAnimatedReaction(
    () => scrollY.value,
    (scrolling) => {
      scrollTo(scrollViewRef, 0, scrolling, false);
    }
  );

  // Handle scroll events
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleScrollEnd = useCallback(() => {
    let localScrollTimeout: NodeJS.Timeout | null = null;
    if (localScrollTimeout) {
      clearTimeout(localScrollTimeout);
    }
    localScrollTimeout = setTimeout(() => {
      dropProviderRef.current?.requestPositionUpdate();
    }, 50);
  }, []);

  // Calculate content height
  const contentHeight = data.length * itemHeight;

  // Helper to get props for each sortable item
  const getItemProps = useCallback(
    (item: TData, index: number) => {
      const id = itemKeyExtractor(item, index);
      return {
        id,
        positions,
        lowerBound: scrollY,
        autoScrollDirection: autoScroll,
        itemsCount: data.length,
        itemHeight,
      };
    },
    [data.length, itemHeight, itemKeyExtractor, positions, scrollY, autoScroll]
  );

  return {
    positions,
    scrollY,
    autoScroll,
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  };
}
