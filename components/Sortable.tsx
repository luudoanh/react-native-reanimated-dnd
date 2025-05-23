import React from "react";
import { StyleSheet, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { DropProvider } from "../context/DropContext";
import { SortableProps, SortableRenderItemProps } from "./sortableTypes";
import {
  useSortableList,
  UseSortableListOptions,
} from "../hooks/useSortableList";

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function Sortable<TData extends { id: string }>({
  data,
  renderItem,
  itemHeight,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
}: SortableProps<TData>) {
  const sortableOptions: UseSortableListOptions<TData> = {
    data,
    itemHeight,
    itemKeyExtractor,
  };

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentHeight,
    getItemProps,
  } = useSortableList<TData>(sortableOptions);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
        <AnimatedScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            { height: contentHeight },
            contentContainerStyle,
          ]}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          simultaneousHandlers={dropProviderRef}
        >
          {data.map((item, index) => {
            // Get the item props from our hook
            const itemProps = getItemProps(item, index);

            // Create the complete props with the item and index
            const sortableItemProps: SortableRenderItemProps<TData> = {
              item,
              index,
              ...itemProps,
            };

            return renderItem(sortableItemProps);
          })}
        </AnimatedScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
  },
});
